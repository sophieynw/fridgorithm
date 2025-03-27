import React, { useState, useEffect, useRef } from 'react';
import styles from '../styles/MainPage.module.css';
import * as speechsdk from 'microsoft-cognitiveservices-speech-sdk';
import { getTokenOrRefresh } from '../utils/tokenUtil';
import DebugPanel from './DebugPanel';
import MenuButton from './MenuButton';
import ChatMessage from './ChatMessage';
import LogoutButton from './LogoutButton';
import { sendMessageToOpenAI, getAnotherRecipe } from '../utils/openaiService';
import { ImageAnalyzing, Thinking, Loading } from './LoadingAnimation';
import axios from 'axios';

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
  const [savedIngredients, setSavedIngredients] = useState(null);
  const photoInputRef = useRef(null);

  // When receiving ingredients from image recognition
  const handleImageRecognitionResult = (result, rawIngredients) => {
    // Extract the ingredients text from the AI response if not directly provided
    let ingredientsText = rawIngredients
      ? rawIngredients.join(', ')
      : extractIngredientsFromText(result);

    // Save ingredients for future use
    if (ingredientsText) {
      setSavedIngredients(ingredientsText);
    }

    // Add the AI's response to chat
    setMessages((prev) => [
      ...prev,
      {
        text: result,
        sender: 'assistant',
      },
    ]);

    // Now send these ingredients to OpenAI for recipe suggestions
    const userMessage = `I have these ingredients: ${ingredientsText}. What can I cook with them?`;

    // Send to OpenAI asynchronously
    setIsLoading(true);
    sendMessageToOpenAI([
      {
        role: 'system',
        content:
          'You are a helpful AI assistant that provides cooking recipes based on ingredients.',
      },
      { role: 'user', content: userMessage },
    ])
      .then((aiResponse) => {
        // Add AI response to messages
        setMessages((prev) => [
          ...prev,
          { text: aiResponse.content, sender: 'assistant' },
        ]);
      })
      .catch((error) => {
        console.error('Failed to get AI response:', error);
        setMessages((prev) => [
          ...prev,
          {
            text: `Sorry, I couldn't generate a recipe right now. Please try again.`,
            sender: 'assistant',
          },
        ]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  // Extract ingredients from the AI's response text
  const extractIngredientsFromText = (text) => {
    // Look for patterns like "I can see these ingredients: tomato, onion, etc."
    const match =
      text.match(/ingredients:(.+?)(?=\.|$)/i) ||
      text.match(/I can see.*?:(.+?)(?=\.|$)/i) ||
      text.match(/I see.*?:(.+?)(?=\.|$)/i);

    if (match && match[1]) {
      return match[1].trim();
    }

    return null;
  };

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
      const userMessage = inputText.trim();
      setInputText('');
      setMessages((prev) => [...prev, { text: userMessage, sender: 'user' }]);
      setIsLoading(true);

      try {
        // Check if user is asking for another recipe
        const isAskingForAnotherRecipe =
          userMessage.toLowerCase().includes('another recipe') ||
          userMessage.toLowerCase().includes('other recipe') ||
          userMessage.toLowerCase().includes('different recipe') ||
          userMessage.toLowerCase().includes('more recipe');

        let response;

        if (isAskingForAnotherRecipe && savedIngredients) {
          // Use the imported getAnotherRecipe function
          response = await getAnotherRecipe(savedIngredients);
        } else {
          // Regular request - just send the current message
          response = await sendMessageToOpenAI([
            {
              role: 'system',
              content:
                'You are a helpful AI assistant that provides cooking recipes based on ingredients.',
            },
            { role: 'user', content: userMessage },
          ]);
        }

        setMessages((prev) => [
          ...prev,
          {
            text: response.content,
            sender: 'assistant',
          },
        ]);
      } catch (error) {
        console.error('Failed to get AI response:', error);
        setMessages((prev) => [
          ...prev,
          {
            text: `Sorry, I had trouble processing your request: ${error.message}. Please try again.`,
            sender: 'assistant',
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handlePhotoUpload = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const fileUrl = URL.createObjectURL(file);

      // Add image message to UI
      setMessages((prev) => [
        ...prev,
        { type: 'image', imageUrl: fileUrl, sender: 'user' },
      ]);

      setIsAnalyzingImage(true);

      try {
        // Create form data for the file upload
        const formData = new FormData();
        formData.append('image', file);

        // Send to Azure Vision API for analysis
        const response = await axios.post('/api/vision/analyze', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // Get the ingredients from the response
        const ingredients = response.data.tags || [];

        // Create a message about the identified ingredients
        const ingredientsMessage = `I can see these ingredients: ${ingredients.join(
          ', '
        )}. What would you like to cook with them?`;

        // Call handleImageRecognitionResult here with the result
        handleImageRecognitionResult(ingredientsMessage, ingredients);
      } catch (error) {
        console.error('Image analysis error:', error);
        setMessages((prev) => [
          ...prev,
          {
            text: 'Sorry, there was a problem analyzing the image or contacting the assistant.',
            sender: 'assistant',
          },
        ]);
      } finally {
        setIsAnalyzingImage(false);
        if (photoInputRef.current) {
          photoInputRef.current.value = '';
        }
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
