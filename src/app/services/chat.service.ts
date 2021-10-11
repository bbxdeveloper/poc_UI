import { Injectable } from '@angular/core';

export const messages = [
  {
    text: 'Tisztelettel kérdezném, hogy a szállítmányozás melyik raktárba lenne a legmegfelelőbb?',
    reply: false,
    date: new Date(),
    user: {
      name: 'Kecskemét',
      // avatar: 'https://i.gifer.com/no.gif',
    },
  },
  {
    text: 'Üdvözlöm! A Budapesti raktár lenne a legmegfelelőbb egy ekkora vételhez, de ha hajlandó felezni a szállítást, akkor meg tudok adni 2 másik címet is.',
    reply: true,
    date: new Date(),
    user: {
      name: 'Szolnok',
      // avatar: 'https://i.gifer.com/no.gif',
    },
  },
  {
    text: 'Megfontolom. Mikor tudnánk személyesen is beszélni?',
    reply: false,
    date: new Date(),
    user: {
      name: 'Kecskemét',
      avatar: '',
    },
  },
  {
    text: 'Akár már most is. Ha feljön a megszokott online találkozóra, már várni fogom ott.',
    reply: true,
    date: new Date(),
    /*type: 'file',
    files: [
      {
        url: 'https://i.gifer.com/no.gif',
        type: 'image/jpeg',
        icon: false,
      },
    ],*/
    user: {
      name: 'Szolnok',
      avatar: '',
    },
  }
];

const botAvatar: string = 'https://s3.amazonaws.com/pix.iemoji.com/images/emoji/apple/ios-12/256/robot-face.png';

export const gifsLinks: string[] = [
  'https://media.tenor.com/images/ac287fd06319e47b1533737662d5bfe8/tenor.gif',
  'https://i.gifer.com/no.gif',
  'https://techcrunch.com/wp-content/uploads/2015/08/safe_image.gif',
  'http://www.reactiongifs.com/r/wnd1.gif',
];
export const imageLinks: string[] = [
  'https://picsum.photos/320/240/?image=357',
  'https://picsum.photos/320/240/?image=556',
  'https://picsum.photos/320/240/?image=339',
  'https://picsum.photos/320/240/?image=387',
  'https://picsum.photos/320/240/?image=30',
  'https://picsum.photos/320/240/?image=271',
];
const fileLink: string = 'http://google.com';

export const botReplies = [
  // {
  //   regExp: /([H,h]ey)|([H,h]i)/g,
  //   answerArray: ['Hello!', 'Yes?', 'Yes, milord?', 'What can I do for you?'],
  //   type: 'text',
  //   reply: {
  //     text: '',
  //     reply: false,
  //     date: new Date(),
  //     user: {
  //       name: 'Bot',
  //       avatar: botAvatar,
  //     },
  //   },
  // },
  // {
  //   regExp: /([H,h]elp)/g,
  //   answerArray: [`No problem! Try sending a message containing word "hey", "image",
  //   "gif", "file", "map", "quote", "file group" to see different message components`],
  //   type: 'text',
  //   reply: {
  //     text: '',
  //     reply: false,
  //     date: new Date(),
  //     user: {
  //       name: 'Bot',
  //       avatar: botAvatar,
  //     },
  //   },
  // },
  // {
  //   regExp: /([I,i]mage)|(IMAGE)|([P,p]ic)|(Picture)/g,
  //   answerArray: ['Hey look at this!', 'Ready to work', 'Yes, master.'],
  //   type: 'pic',
  //   reply: {
  //     text: '',
  //     reply: false,
  //     date: new Date(),
  //     type: 'file',
  //     files: [
  //       {
  //         url: '',
  //         type: 'image/jpeg',
  //       },
  //     ],
  //     user: {
  //       name: 'Bot',
  //       avatar: botAvatar,
  //     },
  //   },
  // },
  // {
  //   regExp: /([G,g]if)|(GIF)/g,
  //   type: 'gif',
  //   answerArray: ['No problem', 'Well done', 'You got it man'],
  //   reply: {
  //     text: '',
  //     reply: false,
  //     date: new Date(),
  //     type: 'file',
  //     files: [
  //       {
  //         url: '',
  //         type: 'image/gif',
  //       },
  //     ],
  //     user: {
  //       name: 'Bot',
  //       avatar: botAvatar,
  //     },
  //   },
  // },
  // {
  //   regExp: /([F,f]ile group)|(FILE)/g,
  //   type: 'group',
  //   answerArray: ['Take it!', 'Job Done.', 'As you wish'],
  //   reply: {
  //     text: '',
  //     reply: false,
  //     date: new Date(),
  //     type: 'file',
  //     files: [
  //       {
  //         url: fileLink,
  //         icon: 'file-text-outline',
  //       },
  //       {
  //         url: '',
  //         type: 'image/gif',
  //       },
  //       {
  //         url: '',
  //         type: 'image/jpeg',
  //       },
  //     ],
  //     icon: 'file-text-outline',
  //     user: {
  //       name: 'Bot',
  //       avatar: botAvatar,
  //     },
  //   },
  // },
  // {
  //   regExp: /([F,f]ile)|(FILE)/g,
  //   type: 'file',
  //   answerArray: ['Take it!', 'Job Done.', 'As you wish'],
  //   reply: {
  //     text: '',
  //     reply: false,
  //     date: new Date(),
  //     type: 'file',
  //     files: [
  //       {
  //         url: fileLink,
  //         icon: 'file-text-outline',
  //       },
  //     ],
  //     icon: 'file-text-outline',
  //     user: {
  //       name: 'Bot',
  //       avatar: botAvatar,
  //     },
  //   },
  // },
  // {
  //   regExp: /([M,m]ap)|(MAP)/g,
  //   type: 'map',
  //   answerArray: ['Done.', 'My sight is yours.', 'I shall be your eyes.'],
  //   reply: {
  //     text: '',
  //     reply: false,
  //     date: new Date(),
  //     type: 'map',
  //     latitude: 53.914321,
  //     longitude: 27.5998355,
  //     user: {
  //       name: 'Bot',
  //       avatar: botAvatar,
  //     },
  //   },
  // },
  // {
  //   regExp: /([Q,q]uote)|(QUOTE)/g,
  //   type: 'quote',
  //   answerArray: ['Quoted!', 'Say no more.', 'I gladly obey.'],
  //   reply: {
  //     text: '',
  //     reply: false,
  //     date: new Date(),
  //     type: 'quote',
  //     quote: '',
  //     user: {
  //       name: 'Bot',
  //       avatar: botAvatar,
  //     },
  //   },
  // },
  // {
  //   regExp: /(.*)/g,
  //   answerArray: ['Üdvözlöm! Segítséghez gépelje be: help'],
  //   type: 'text',
  //   reply: {
  //     text: '',
  //     reply: false,
  //     date: new Date(),
  //     user: {
  //       name: 'Bot',
  //       avatar: botAvatar,
  //     },
  //   },
  // },
  {
    regExp: /(.*)/g,
    answerArray: ['Automatikusan generált válasz.'],
    type: 'text',
    reply: {
      text: '',
      reply: false,
      date: new Date(),
      user: {
        name: 'Bot',
        avatar: botAvatar,
      },
    },
  },
];

@Injectable()
export class ChatService {


  loadMessages() {
    return messages;
  }

  loadBotReplies() {
    return botReplies;
  }

  reply(message: string) {
    const botReply: any = this.loadBotReplies()
      .find((reply: any) => message.search(reply.regExp) !== -1);

    if (botReply.reply.type === 'quote') {
      botReply.reply.quote = message;
    }

    if (botReply.type === 'gif') {
      botReply.reply.files[0].url = gifsLinks[Math.floor(Math.random() * gifsLinks.length)];
    }

    if (botReply.type === 'pic') {
      botReply.reply.files[0].url = imageLinks[Math.floor(Math.random() * imageLinks.length)];
    }

    if (botReply.type === 'group') {
      botReply.reply.files[1].url = gifsLinks[Math.floor(Math.random() * gifsLinks.length)];
      botReply.reply.files[2].url = imageLinks[Math.floor(Math.random() * imageLinks.length)];
    }

    botReply.reply.text = botReply.answerArray[Math.floor(Math.random() * botReply.answerArray.length)];
    return { ...botReply.reply };
  }
}