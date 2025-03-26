import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/MainPage.module.css';
import * as speechsdk from 'microsoft-cognitiveservices-speech-sdk';
import { getTokenOrRefresh } from '../utils/tokenUtil';
import DebugPanel from './DebugPanel';
import MenuButton from './MenuButton';
import ChatMessage from './ChatMessage';
import LogoutButton from './LogoutButton';
import { sendMessageToOpenAI } from '../utils/openaiService';
import { ImageAnalyzing, Thinking, Loading } from './LoadingAnimation';

const MainPage = () => {
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechConfig, setSpeechConfig] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const recognizerRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [isSpeechInitializing, setIsSpeechInitializing] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([
    {
      role: 'system',
      content:
        'You are a helpful AI assistant that provides cooking suggestions based on ingredients users have in their fridge. Format your responses using markdown for better readability: \n\n' +
        '- Use **bold text** for important information\n' +
        '- Use bullet points (like this list) for ingredients\n' +
        '- Use numbered lists (1., 2., 3.) for recipe steps\n' +
        '- Use headings (# or ##) for recipe titles\n' +
        '- Add blank lines between paragraphs\n\n' +
        'Make your responses easy to read with proper formatting.',
    },
  ]);

  useEffect(() => {
    return () => {
      // Clean up any object URLs when the component unmounts
      messages.forEach((message) => {
        if (message.type === 'image' && message.imageUrl) {
          URL.revokeObjectURL(message.imageUrl);
        }
      });
    };
  }, [messages]);

  const photoInputRef = useRef(null);

  useEffect(() => {
    //Initialize speech config when component mounts
    async function initializeSpeechConfig() {
      try {
        setIsSpeechInitializing(true);
        setStatusMessage('Initializing speech services...');

        const tokenObj = await getTokenOrRefresh();

        if (tokenObj.authToken) {
          const config = speechsdk.SpeechConfig.fromAuthorizationToken(
            tokenObj.authToken,
            tokenObj.region
          );
          config.speechRecognitionLanguage = 'en-US';
          setSpeechConfig(config);
          setStatusMessage('');
        } else {
          setStatusMessage(`Error: ${tokenObj.error || 'Could not get token'}`);
        }
      } catch (error) {
        console.error('Failed to initialize speech services:', error);
        setStatusMessage(
          'Error initializing speech services. Please try again later.'
        );
      } finally {
        setIsSpeechInitializing(false);
      }
    }

    initializeSpeechConfig();

    // Cleanup function to stop recognition if component unmounts
    return () => {
      if (recognizerRef.current) {
        recognizerRef.current.stopContinuousRecognitionAsync();
        recognizerRef.current.close();
        recognizerRef.current = null;
      }
    };
  }, []);

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen); //Toggle menu state
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleVoiceInput = async () => {
    // If already listening, stop recognition
    if (isListening) {
      stopListening();
      return;
    }

    // Check if we need to initialize or refresh the speech config
    if (!speechConfig) {
      setIsSpeechInitializing(true);
      setStatusMessage('Initializing speech services...');

      try {
        const tokenObj = await getTokenOrRefresh();

        if (tokenObj.authToken) {
          const config = speechsdk.SpeechConfig.fromAuthorizationToken(
            tokenObj.authToken,
            tokenObj.region
          );
          config.speechRecognitionLanguage = 'en-US';
          setSpeechConfig(config);
        } else {
          setStatusMessage(`Error: ${tokenObj.error || 'Could not get token'}`);
          setIsSpeechInitializing(false);
          return;
        }
      } catch (error) {
        console.error('Failed to initialize speech services:', error);
        setStatusMessage(
          'Error initializing speech services. Please try again later.'
        );
        setIsSpeechInitializing(false);
        return;
      } finally {
        setIsSpeechInitializing(false);
      }
    }

    try {
      // Use the speechConfig from state
      const audioConfig = speechsdk.AudioConfig.fromDefaultMicrophoneInput();
      const recognizer = new speechsdk.SpeechRecognizer(
        speechConfig,
        audioConfig
      );
      recognizerRef.current = recognizer;

      // Set up event handlers
      recognizer.recognized = (s, e) => {
        if (
          e.result.reason === speechsdk.ResultReason.RecognizedSpeech &&
          e.result.text
        ) {
          setInputText((prevText) => {
            // If there's already text, append with a comma, otherwise just set it
            return prevText ? `${prevText}, ${e.result.text}` : e.result.text;
          });
        }
      };

      recognizer.canceled = (s, e) => {
        if (e.reason === speechsdk.CancellationReason.Error) {
          console.error(`CANCELED: Error - ${e.errorDetails}`);
          setStatusMessage(`Recognition error: ${e.errorDetails}`);

          // If it's an authorization error, reset the speech config
          if (
            e.errorDetails.includes('auth') ||
            e.errorDetails.includes('token')
          ) {
            setSpeechConfig(null);
          }
        }
        stopListening();
      };

      recognizer.sessionStopped = () => {
        stopListening();
      };

      // Start continuous recognition
      recognizer.startContinuousRecognitionAsync(
        () => {
          setIsListening(true);
          setStatusMessage('Listening...');
        },
        (error) => {
          console.error('Cannot start recognition:', error);
          setStatusMessage('Failed to start recognition');
          setIsListening(false);
        }
      );
    } catch (error) {
      console.error('Recognition error:', error);
      setStatusMessage('Error initializing speech recognition');
    }
  };

  const stopListening = () => {
    if (recognizerRef.current) {
      recognizerRef.current.stopContinuousRecognitionAsync(
        () => {
          setIsListening(false);
          setStatusMessage('');
        },
        (error) => {
          console.error('Error stopping recognition:', error);
          setIsListening(false);
          setStatusMessage('Error stopping recognition');
        }
      );
    } else {
      setIsListening(false);
      setStatusMessage('');
    }
  };

  const handleSubmit = async () => {
    if (inputText.trim()) {
      // Add user message to UI
      const userMessage = { text: inputText, sender: 'user' };
      setMessages((prev) => [...prev, userMessage]);

      // Update conversation history
      const userMessageForAPI = { role: 'user', content: inputText };
      const updatedHistory = [...conversationHistory, userMessageForAPI];
      setConversationHistory(updatedHistory);

      // Clear input field
      setInputText('');

      // Show loading state
      setIsLoading(true);

      try {
        // Send message to OpenAI
        const aiResponse = await sendMessageToOpenAI(updatedHistory);

        // Add AI response to UI
        const aiMessage = { text: aiResponse.content, sender: 'assistant' };
        setMessages((prev) => [...prev, aiMessage]);

        // Update conversation history with AI response
        setConversationHistory([
          ...updatedHistory,
          {
            role: 'assistant',
            content: aiResponse.content,
          },
        ]);
      } catch (error) {
        console.error('Failed to get AI response:', error);
        setMessages((prev) => [
          ...prev,
          {
            text: 'Sorry, I had trouble processing your request. Please try again.',
            sender: 'assistant',
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Create a URL for the image preview
    const imageUrl = URL.createObjectURL(file);

    const formData = new FormData();
    formData.append('image', file);

    try {
      // Set analyzing image state to true to show the animation
      setIsAnalyzingImage(true);

      // Add the image to the chat immediately
      const imageMessage = {
        type: 'image',
        imageUrl: imageUrl,
        sender: 'user',
      };
      setMessages((prev) => [...prev, imageMessage]);

      const response = await fetch('http://localhost:3000/api/vision/analyze', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const detectedItems = data.tags ? data.tags.join(', ') : '';

      // Turn off the image analyzing animation
      setIsAnalyzingImage(false);

      // Send the detected items to the API but don't add as a visible message
      const userMessageForAPI = {
        role: 'user',
        content: `Food items detected: ${detectedItems}. Please suggest recipes based on these ingredients.`,
      };
      const updatedHistory = [...conversationHistory, userMessageForAPI];
      setConversationHistory(updatedHistory);

      // Switch to thinking animation
      setIsLoading(true);

      const aiResponse = await sendMessageToOpenAI(updatedHistory);
      const aiMessage = { text: aiResponse.content, sender: 'assistant' };
      setMessages((prev) => [...prev, aiMessage]);

      setConversationHistory([
        ...updatedHistory,
        {
          role: 'assistant',
          content: aiResponse.content,
        },
      ]);
    } catch (error) {
      console.error('Error analyzing image or getting AI response:', error);
      setMessages((prev) => [
        ...prev,
        {
          text: 'Sorry, there was a problem analyzing the image or contacting the assistant.',
          sender: 'assistant',
        },
      ]);
    } finally {
      setIsAnalyzingImage(false);
      setIsLoading(false);
      if (photoInputRef.current) {
        photoInputRef.current.value = '';
      }
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <MenuButton
          onClick={handleMenuClick}
          isOpen={isMenuOpen}
          ariaLabel="Toggle Menu"
        />
        <h1 className={styles.logo}>fridgorithm</h1>
        <LogoutButton />
      </header>

      <main className={styles.mainContent}>
        <div className={styles.questionContainer}>
          <h2 className={styles.question}>What's in your fridge?</h2>
          {statusMessage && (
            <div className={styles.statusMessage}>{statusMessage}</div>
          )}
        </div>

        <div className={styles.chatContainer}>
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}

          {/* Use all appropriate loading animations */}
          {isAnalyzingImage && <ImageAnalyzing />}
          {isLoading && <Thinking />}
          {isSpeechInitializing && (
            <Loading message="Initializing speech services" />
          )}
        </div>

        <div className={styles.inputArea}>
          <input
            type="text"
            className={styles.input}
            placeholder="What do you want to cook today?"
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSubmit();
              }
            }}
          />

          <input
            type="file"
            accept="image/*"
            capture="environment" //This is for camera access for mobile devices
            onChange={handlePhotoUpload}
            ref={photoInputRef}
            style={{ display: 'none' }}
          />

          <div className={styles.buttonContainer}>
            <button
              className={styles.iconButton}
              aria-label="Upload Photo"
              onClick={() => photoInputRef.current.click()}
              disabled={isAnalyzingImage || isLoading || isSpeechInitializing}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z"
                />
              </svg>
            </button>
            <button
              className={`${styles.iconButton} ${
                isListening ? styles.listening : ''
              }`}
              aria-label={
                isListening ? 'Stop Voice Input' : 'Start Voice Input'
              }
              onClick={handleVoiceInput}
              disabled={isSpeechInitializing || isAnalyzingImage || isLoading}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z"
                />
              </svg>
            </button>
            <button
              className={styles.iconButton}
              aria-label="Submit"
              onClick={handleSubmit}
              disabled={isLoading || isAnalyzingImage || isSpeechInitializing}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                width="24px"
                height="24px"
              >
                <path d="M0 0h24v24H0V0z" fill="none" />
                <path d="M4 12l1.41 1.41L11 7.83V20h2V7.83l5.58 5.59L20 12l-8-8-8 8z" />
              </svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainPage;
