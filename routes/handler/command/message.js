module.exports = message = async (client, message) => {
    try {
        const {
            type,
            body,
            id,
            from,
            t,
            sender,
            isGroupMsg,
            chat,
            caption,
            isMedia,
            mimetype,
            quotedMsg,
            quotedMsgObj,
            mentionedJidList
        } = message;
        const commands = caption || body || '';
        const command = commands.toLowerCase().split(' ')[0] || '';
        console.log(command);
        switch (command) {
            case 'hi':
                client.sendText(from, 'Halo Juga');
                break;
            case 'sticker':
                client.sendStickerfromUrl(from, 'https://cdn16.1cak.com/posts/b5b34870a9d0f13420f7d1f541c02cea_t.jpg',null, { author: "authorWm", pack: "packWm" });
                break;
        }
    } catch (error) {
        console.log(error);
    }
}