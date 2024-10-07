import React, { useState, useEffect, useRef } from 'react';
import { FaMicrophone, FaStop } from 'react-icons/fa';
import { textToSpeech, speechToText } from '../services/googleSpeechServices';
import { getPersonalizedRecommendations, addToCart } from '../services/api';

const VoiceAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [botResponse, setBotResponse] = useState('');
  const [aiCart, setAiCart] = useState([]);

  const audioContext = useRef(null);
  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  useEffect(() => {
    audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    return () => {
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);

  const startListening = async () => {
    setIsListening(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        audioChunks.current.push(event.data);
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
        const transcription = await speechToText(audioBlob);
        setTranscript(transcription);
        processVoiceCommand(transcription);
      };

      mediaRecorder.current.start();
      speak("Welcome to Ecub Food order service. What would you like to order today?");
    } catch (error) {
      console.error('Error starting voice recording:', error);
    }
  };

  const stopListening = () => {
    setIsListening(false);
    if (mediaRecorder.current && mediaRecorder.current.state !== 'inactive') {
      mediaRecorder.current.stop();
    }
  };

  const speak = async (text) => {
    try {
      const audioContent = await textToSpeech(text);
      const audioBuffer = await audioContext.current.decodeAudioData(audioContent);
      const source = audioContext.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.current.destination);
      source.start(0);
      setBotResponse(text);
    } catch (error) {
      console.error('Error in text-to-speech:', error);
    }
  };

  const processVoiceCommand = async (command) => {
    const lowerCommand = command.toLowerCase();

    if (lowerCommand.includes('checkout')) {
      speak("Alright, I'll close the voice assistant. Please proceed to manual checkout.");
      stopListening();
      return;
    }

    try {
      const recommendations = await getPersonalizedRecommendations(command);
      
      if (recommendations.length > 0) {
        const item = recommendations[0];
        const quantity = extractQuantity(lowerCommand) || 1;
        
        addToAiCart(item, quantity);
        await addToCart(item.id, quantity);
        
        speak(`Added ${quantity} ${item.productTitle} to your cart. Is there anything else you'd like to order?`);
      } else {
        speak("I'm sorry, I couldn't find any items matching your request. Could you please try again?");
      }
    } catch (error) {
      console.error('Error processing voice command:', error);
      speak("I'm sorry, there was an error processing your request. Please try again.");
    }
  };

  const extractQuantity = (command) => {
    const words = command.split(' ');
    const numberWords = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'];
    for (let i = 0; i < words.length; i++) {
      if (!isNaN(words[i])) {
        return parseInt(words[i]);
      }
      const index = numberWords.indexOf(words[i].toLowerCase());
      if (index !== -1) {
        return index + 1;
      }
    }
    return null;
  };

  const addToAiCart = (item, quantity) => {
    setAiCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem => 
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + quantity } : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity }];
      }
    });
  };

  return (
    <div className="voice-assistant">
      <button onClick={isListening ? stopListening : startListening}>
        {isListening ? <FaStop /> : <FaMicrophone />}
      </button>
      {isListening && <p>Listening...</p>}
      <p>You said: {transcript}</p>
      <p>Bot response: {botResponse}</p>
      <div className="ai-cart">
        <h3>AI Cart</h3>
        <ul>
          {aiCart.map((item, index) => (
            <li key={index}>{item.quantity} x {item.productTitle}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default VoiceAssistant;