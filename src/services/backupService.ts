import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { AppState } from '../context/AppStateContext';

const GOOGLE_DRIVE_API_URL = 'https://www.googleapis.com/drive/v3';
const BACKUP_FILE_NAME = 'noor_companion_backup.json';

export const backupToFirestore = async (uid: string, state: AppState) => {
  try {
    await setDoc(doc(db, 'users', uid), {
      ...state,
      lastBackup: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error) {
    console.error('Firestore backup failed:', error);
    return false;
  }
};

export const backupToGoogleDrive = async (uid: string, state: AppState) => {
  const token = localStorage.getItem(`google_drive_token_${uid}`);
  if (!token) return false;

  try {
    // 1. Search for existing backup file in appDataFolder
    const searchResponse = await fetch(
      `${GOOGLE_DRIVE_API_URL}/files?q=name='${BACKUP_FILE_NAME}'&spaces=appDataFolder`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    const searchData = await searchResponse.json();
    const existingFile = searchData.files?.[0];

    const metadata = {
      name: BACKUP_FILE_NAME,
      parents: ['appDataFolder']
    };

    const fileContent = JSON.stringify(state);
    const boundary = '-------314159265358979323846';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const body =
      delimiter +
      'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
      JSON.stringify(metadata) +
      delimiter +
      'Content-Type: application/json\r\n\r\n' +
      fileContent +
      closeDelimiter;

    let url = `${GOOGLE_DRIVE_API_URL}/files?uploadType=multipart`;
    let method = 'POST';

    if (existingFile) {
      url = `https://www.googleapis.com/upload/drive/v3/files/${existingFile.id}?uploadType=multipart`;
      method = 'PATCH';
    } else {
      url = `https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart`;
    }

    const uploadResponse = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': `multipart/related; boundary=${boundary}`
      },
      body
    });

    return uploadResponse.ok;
  } catch (error) {
    console.error('Google Drive backup failed:', error);
    return false;
  }
};

export const restoreFromGoogleDrive = async (uid: string) => {
  const token = localStorage.getItem(`google_drive_token_${uid}`);
  if (!token) return null;

  try {
    const searchResponse = await fetch(
      `${GOOGLE_DRIVE_API_URL}/files?q=name='${BACKUP_FILE_NAME}'&spaces=appDataFolder`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    const searchData = await searchResponse.json();
    const existingFile = searchData.files?.[0];

    if (!existingFile) return null;

    const fileResponse = await fetch(
      `${GOOGLE_DRIVE_API_URL}/files/${existingFile.id}?alt=media`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    
    if (fileResponse.ok) {
      return await fileResponse.json();
    }
    return null;
  } catch (error) {
    console.error('Google Drive restore failed:', error);
    return null;
  }
};
