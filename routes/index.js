const express = require('express');
const router = express.Router();

const { create, Client } = require('@open-wa/wa-automate');

const options = require('../config/config');
const messages = require('./handler/command/message');
const start = async (client = new Client()) => {
  console.log('[SERVER] Server Started!');
  // Force it to keep the current session
  client.onStateChanged((state) => {
    console.log('[Client State]', state)
    if (state === 'CONFLICT' || state === 'UNLAUNCHED') client.forceRefocus()
  });
  // listening on message
  client.onMessage((async (message) => {
    client.getAmountOfLoadedMessages()
        .then((msg) => {
          if (msg >= 3000) {
            client.cutMsgCache()
          }
        });
    await messages(client, message);
  }))

  // await client.onGlobalParticipantsChanged((async (heuh) => {
  //   await welcome(client, heuh)
  //   //left(client, heuh)
  // }));

  await client.onAddedToGroup(((chat) => {
    let totalMem = chat.groupMetadata.participants.length
    if (totalMem < 30) {
      client.sendText(chat.id, `Cih member nya cuma ${totalMem}, Kalo mau invite bot, minimal jumlah mem ada 30`).then(() => client.leaveGroup(chat.id)).then(() => client.deleteChat(chat.id))
    } else {
      client.sendText(chat.groupMetadata.id, `Halo warga grup *${chat.contact.name}* terimakasih sudah menginvite bot ini, untuk melihat menu silahkan kirim *!help*`)
    }
  }))

  /*client.onAck((x => {
      const { from, to, ack } = x
      if (x !== 3) client.sendSeen(to)
  }))*/

  // listening on Incoming Call
  await client.onIncomingCall((async (call) => {
    await client.sendText(call.peerJid, 'Maaf, saya tidak bisa menerima panggilan. nelfon = block!')
        .then(() => client.contactBlock(call.peerJid))
  }));

  router.post('/send-message', async (req, res) => {
    const {to, body} = req.body;
    try {
      console.log(to+body);

      const result = await client.sendText(to, body);
      res.send(result);
    } catch (error) {
      res.send(error);
      res.status(500).send(error);
    }
  });

};


create(options(true, start))
    .then(client => start(client))
    .catch((error) => console.log(error))



module.exports = router;
