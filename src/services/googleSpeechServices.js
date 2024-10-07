import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const textToSpeech = async (text) => {
  try {
    const response = await axios.post(`${API_URL}/api/text-to-speech`, { text });
    return response.data;
  } catch (error) {
    console.error('Error in text-to-speech:', error);
    throw error;
  }
};

export const speechToText = async (audioBlob) => {
  try {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'audio.wav');
    const response = await axios.post(`${API_URL}/api/speech-to-text`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.transcript;
  } catch (error) {
    console.error('Error in speech-to-text:', error);
    throw error;
  }
};