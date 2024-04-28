const express = require("express");
const cor = require("cors");
const admin = require("firebase-admin");
const serviceAccount = require("./chatbuddy-9d4f4-firebase-adminsdk-dxmna-305dbf7b42.json");

const app = express();


app.use(express.json());
app.use(cor());


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://chatbuddy-9d4f4-default-rtdb.firebaseio.com"
});
const db = admin.firestore();

app.post('/disable-user', async (req, res) => {
  const { userId } = req.body;

  try {
    await admin.auth().updateUser(userId, {
      disabled: true
    });

    const userRef = db.collection('users').doc(userId);

    
    await userRef.update({
      disabled: true
    });

    res.json({ message: 'User account disabled successfully!' });
  } catch (error) {
    console.error('Error disabling user account:', error);
    res.status(500).json({ error: 'Failed to disable user account' });
  }
});


app.post('/enable-user', async (req, res) => {
  const { userId } = req.body;

  try {
    await admin.auth().updateUser(userId, {
      disabled: false 
    });

    const userRef = db.collection('users').doc(userId);

    
    await userRef.update({
      disabled: false
    });
    res.json({ message: 'User account enabled successfully!' });
  } catch (error) {
    console.error('Error enabling user account:', error);
    res.status(500).json({ error: 'Failed to enable user account' });
  }
});



app.get('/get-user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const userRecord = await admin.auth().getUser(userId);
    res.json({ disabled: userRecord.disabled });
  } catch (error) {
    console.error('Error fetching user information:', error);
    res.status(500).json({ error: 'Failed to fetch user information' });
  }
});


app.get('/get-disable/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
   
    const userDoc = await admin.firestore().collection('users').doc(userId).get();
    
  
    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }
    
  
    const { disabled } = userDoc.data();
   
    res.json({ disabled });
  } catch (error) {
    console.error('Error fetching user information:', error);
    res.status(500).json({ error: 'Failed to fetch user information' });
  }

});

app.post('/update-user-name/:userId', async (req, res) => {
  const { userId } = req.params;
  const { name } = req.body;

  try {
    const userRef = db.collection('users').doc(userId);


    await userRef.update({ name });

    res.json({ message: 'User name updated successfully!' });
  } catch (error) {
    console.error('Error updating user name:', error);
    res.status(500).json({ error: 'Failed to update user name' });
  }
});


app.get('/fetch-bot-data', async (req, res) => {
  try {
    const botSnapshot = await db.collection('Bot').get();
    const botData = [];

   
    for (const doc of botSnapshot.docs) {
      const orderedRef = doc.ref.collection('Ordered');
      const orderedSnapshot = await orderedRef.get();

     
      orderedSnapshot.forEach(orderedDoc => {
        botData.push({  
          orderedData: orderedDoc.data()
        });
      });
    }
    console.log(botData);
    res.json({ data: botData });
  } catch (error) {
    console.error('Error fetching bot data:', error);
    res.status(500).json({ error: 'Failed to fetch bot data' });
  }
});




const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
