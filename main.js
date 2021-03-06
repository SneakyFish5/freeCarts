/*
  ____                _       _  __               _
 |  _ \              | |     | |/ _|             (_)
 | |_) |_   _        | | __ _| | |_ _ __ __ _ _____
 |  _ <| | | |   _   | |/ _` | |  _| '__/ _` |_  / |
 | |_) | |_| |  | |__| | (_| | | | | | | (_| |/ /| |
 |____/ \__, |   \____/ \__,_|_|_| |_|  \__,_/___|_|
         __/ |
        |___/
 */
const electron = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');
const {
    app,
    BrowserWindow,
    ipcMain
} = electron;

let mainWindow;


// Listen for app to be ready
app.on('ready', function () {
    //create new window
    mainWindow = new BrowserWindow({
        width: 800,
        height: 710,
        minWidth: 800,
        minHeight: 710,
    });
    //mainWindow.setMenu(null)
    mainWindow.setTitle('Cart Distribution - Jalfrazi#0001')
    if (process.platform === "win32") {
        mainWindow.setIcon('./kermitsupreme.jpg')
    }
    //load html into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'static/cart.html'),
        protocol: 'file:',
        slashes: true
    }));
});

//catch save
ipcMain.on('configSave', function (e, config) {
    fs.writeFile('config.json', config, (err) => {
        // throws an error, you could also catch it here
        if (err) throw err;
        // success case, the file was saved
        console.log('saved config');
    });
    console.log(config)
});

ipcMain.on('stop',function () {
    app.quit();
});

ipcMain.on('start', function (start) {
    mainWindow.webContents.send('message', 'x');
    const config = require('./config.json');
    const limitConfig = require('./limits.json');
    let stats = require('./stats.json');
    const elmo1SizeLimit = require('./presetlimits.json');
    const elmo2SizeLimit = require('./Priv2.json');
    const fnfSizeLimit = require('./FnFlimits.json');
    const elmo3Limit = require('./STUFFpriv.json');
    const Discord = require('discord.js');
    const bot = new Discord.Client();
    const fs = require('fs');
    let guild;
    let cartNum = 0;
    let redeemedTotal = [];
    let liveTotal = 0;
    let regularCarts = [];
    let baeCarts = [];
    let childCarts = [];
    let elmo1Carts = [];
    let elmo2Carts = [];
    let elmo3Carts = [];
    let fnfCarts = [];
    let channelDecision = 1;

    let cartsStore = [];

    let elmo1LimitCount = {
      "4": 0,
      "4.5": 0,
      "5": 0,
      "5.5": 0,
      "6": 0,
      "6.5": 0,
      "7": 0,
      "7.5": 0,
      "8": 0,
      "8.5": 0,
      "9": 0,
      "9.5": 0,
      "10": 0,
      "10.5": 0,
      "11": 0,
      "11.5": 0,
      "12": 0
    };

    let fnfLimitCount = {
      "4": 0,
      "4.5": 0,
      "5": 0,
      "5.5": 0,
      "6": 0,
      "6.5": 0,
      "7": 0,
      "7.5": 0,
      "8": 0,
      "8.5": 0,
      "9": 0,
      "9.5": 0,
      "10": 0,
      "10.5": 0,
      "11": 0,
      "11.5": 0,
      "12": 0
    };

    let elmo2LimitCount = {
      "4": 0,
      "4.5": 0,
      "5": 0,
      "5.5": 0,
      "6": 0,
      "6.5": 0,
      "7": 0,
      "7.5": 0,
      "8": 0,
      "8.5": 0,
      "9": 0,
      "9.5": 0,
      "10": 0,
      "10.5": 0,
      "11": 0,
      "11.5": 0,
      "12": 0
    };

    let elmo3LimitCount = {
      "4": 0,
      "4.5": 0,
      "5": 0,
      "5.5": 0,
      "6": 0,
      "6.5": 0,
      "7": 0,
      "7.5": 0,
      "8": 0,
      "8.5": 0,
      "9": 0,
      "9.5": 0,
      "10": 0,
      "10.5": 0,
      "11": 0,
      "11.5": 0,
      "12": 0
    };

    /* Server/guild ID */
    let server = config.server;
    /* This is a hidden channel, normal members should not be able to see this */
    let privateChannel = config.privateChannel;
    /* This is a public channel, 'everyone' should be able to see this */
    let regularChannel = config.regularChannel;
    /* This is bae channel */
    let baeChannel = config.baeChannel;
    /* This is channel for elmo1 */
    let elmo1Channel = config.elmo1Channel;
    /* This is channel for elmo2 */
    let elmo2Channel = config.elmo2Channel;
    /* This is channel for elmo3 */
    let elmo3Channel = config.elmo3Channel;
    /* This is channel for fnf */
    let fnfChannel = config.fnfChannel;
    /* This is channel for kid/toddler carts */
    let childChannel = config.childChannel;
    /* Bot login token */
    let botToken = config.botToken;
    //check if user wants one cart per person;
    var quantityCart;
    //checks if user wants messages to stay in channel
    let deleteAfterReact = config.deleteAfterReact;
    // check if user is running for kids/toddler sizes
    let childSizes = config.childSizes;
    //checks if user wants 10 minute expiration
    let after10 = config.after10
    //cool down
    let cooldown = config.cooldown

    bot.login(botToken).catch(err => mainWindow.webContents.send('loginError', 'loginError'));




    bot.on('ready', () => {
        console.log(`Logged in as ${bot.user.username}!`);
        guild = bot.guilds.get(server);
        serverName = guild.name;
        serverImg = 'https://cdn.discordapp.com/icons/' + guild.id + '/' + guild.icon + '.png';
        console.log(serverImg);
        mainWindow.webContents.send('serverImg', serverImg);
        mainWindow.webContents.send('serverName', serverName);
        mainWindow.webContents.send('botName', bot.user.username + '#' + bot.user.discriminator)
    });

    bot.on('message', message => {
        try{
            /* if (message.author.bot) return; */
            if (message.channel.type === 'dm') return;
            if (message.channel.id === privateChannel) {
                cartNum += 1;
                message.embeds.forEach((e) => {
                    if (e.footer) {
                        if (e.footer.text === 'Splashforce') {
                            size = ((e.title).slice(20));
                            email = (e.description).split(' ')[1].split('\n')[0];
                            pass = (e.description).split(': ')[2];
                            loginURL = e.url;
                            img = e.thumbnail.url;
                            /* Look into getting sku from link /shrug */
                            sku = '';
                            //console.log('Size: ' + size);
                            //console.log('Email:Pass : ' + email + ':' + pass);
                            //console.log('Login link: ' + loginURL);
                            //console.log('Image: ' + img);
                            const embed = new Discord.RichEmbed()
                                .setColor(0x00FF00)
                                .setTimestamp()
                                .setDescription(`Size: ${size}`)
                                .setFooter(`Cart: # ${cartNum} • Made by Jalfrazi`, 'https://pbs.twimg.com/profile_images/1088110085912649729/usJQewZx_400x400.jpg')
                                .setThumbnail(img);
                            if (size < 6.5) {
                              baeCarts.push({
                                embed
                              });
                            } else {
                             regularCarts.push({
                                embed
                             });
                            }
                            liveTotal = cartNum - redeemedTotal.length;
                            mainWindow.webContents.send('liveTotal', liveTotal);
                            mainWindow.webContents.send('redeemedTotal', redeemedTotal.length);
                            mainWindow.webContents.send('cartsTotal', cartNum);
                            writeCart(cartNum, email, pass, loginURL, img, size, sku)
                        } else if (e.footer.text === 'yCopp Ultimate Adidas Bot') {
                            //clothing size
                            size = (e.title).split(',')[1];
                            email = (e.fields)[0]['value'];
                            pass = (e.fields)[1]['value'];

                            loginURL = e.url;
                            sku = ((e.title).split(',')[0]);
                            img = `http://demandware.edgesuite.net/sits_pod20-adidas/dw/image/v2/aaqx_prd/on/demandware.static/-/;Sites-adidas-products/en_US/dw8b928257/zoom/${sku}_01_standard.jpg`;
                            //console.log('Size: ' + size);
                            //console.log('Email:Pass : ' + email + ':' + pass);
                            //console.log('Login link: ' + loginURL);
                            //console.log('Image: ' + img);
                            const embed = new Discord.RichEmbed()
                                .setColor(0x00FF00)
                                .setTimestamp()
                                .setDescription(`Size: ${size} \nSKU: ${sku}`)
                                .setFooter(`Cart: # ${cartNum} • Made by Jalfrazi`, 'https://pbs.twimg.com/profile_images/1088110085912649729/usJQewZx_400x400.jpg')
                                .setThumbnail(img);
                            if (size < 6.5) {
                              baeCarts.push({
                                embed
                              });
                            } else {
                             regularCarts.push({
                                embed
                             });
                            }
                            console.log(carts);
                            liveTotal = cartNum - redeemedTotal.length;
                            mainWindow.webContents.send('liveTotal', liveTotal);
                            mainWindow.webContents.send('redeemedTotal', redeemedTotal.length);
                            mainWindow.webContents.send('cartsTotal', cartNum);
                            writeCart(cartNum, email, pass, loginURL, img, size, sku)

                        } else if (e.footer.text === 'LatchKeyIO Adidas Bot') {
                            size = (e.fields)[2]['value'];
                            email = (e.fields)[4]['value'];
                            pass = (e.fields)[5]['value'];

                            loginURL = e.url;
                            img = e.thumbnail.url;
                            sku = (e.fields)[1]['value'];
                            //console.log('Size: ' + size);
                            //console.log('Email:Pass : ' + email + ':' + pass);
                            //console.log('Login link: ' + loginURL);
                            //console.log('Image: ' + img);
                            const embed = new Discord.RichEmbed()
                                .setColor(0x00FF00)
                                .setTimestamp()
                                .setDescription(`Size: ${size} \nSKU: ${sku}`)
                                .setFooter(`Cart: # ${cartNum} • Made by Jalfrazi`, 'https://pbs.twimg.com/profile_images/1088110085912649729/usJQewZx_400x400.jpg')
                                .setThumbnail(img);
                            Number(size);
                            if (channelDecision == 1 && fnfLimitCount[size] < fnfSizeLimit[size]) {
                              fnfCarts.push({
                                embed
                              });
                              fnfLimitCount[size]++
                            } else if (channelDecision == 2 && elmo1LimitCount[size] < elmo1SizeLimit[size]) {
                              elmo1Carts.push({
                                embed
                              });
                              elmo1LimitCount[size]++
                            } else if (channelDecision == 3 && elmo2LimitCount[size] < elmo2SizeLimit[size]) {
                              elmo2Carts.push({
                                embed
                              });
                              elmo2LimitCount[size]++
                            } else if (channelDecision == 4 && elmo3LimitCount[size] < elmo3SizeLimit[size]) {
                              elmo3Carts.push({
                                embed
                              });
                              elmo3LimitCount[size]++
                            } else if (childSizes) {
                              childCarts.push({
                                 embed
                              });
                            } else if (size < 7) {
                              baeCarts.push({
                                embed
                              });
                            } else {
                             regularCarts.push({
                                embed
                             });
                            }

                            if (channelDecision < 5) {
                              channelDecision++
                            } else {
                              channelDecision = 1
                            }

                            liveTotal = cartNum - redeemedTotal.length;
                            mainWindow.webContents.send('liveTotal', liveTotal);;
                            mainWindow.webContents.send('redeemedTotal', redeemedTotal.length);
                            mainWindow.webContents.send('cartsTotal', cartNum);
                            writeCart(cartNum, email, pass, loginURL, img, size, sku)
                            saveStats(cartNum, redeemedTotal.length);
                        } else if (e.footer.text === 'Sole AIO Adidas Mode') {
                            size = (e.fields)[1]['value'];
                            email = (e.fields)[2]['value'];
                            pass = (e.fields)[3]['value'];

                            loginURL = e.url;
                            img = e.thumbnail.url;
                            sku = (e.title).slice(0,6);
                            //console.log('Size: ' + size);
                            //console.log('Email:Pass : ' + email + ':' + pass);
                            //console.log('Login link: ' + loginURL);
                            //console.log('Image: ' + img);
                            const embed = new Discord.RichEmbed()
                                .setColor(0x00FF00)
                                .setTimestamp()
                                .setDescription(`Size: ${size} \nSKU: ${sku}`)
                                .setFooter(`Cart: # ${cartNum} • Made by Jalfrazi`, 'https://pbs.twimg.com/profile_images/1088110085912649729/usJQewZx_400x400.jpg')
                                .setThumbnail(img);
                            Number(size);
                            if (channelDecision == 1 && fnfLimitCount[size] < fnfSizeLimit[size]) {
                              fnfCarts.push({
                                embed
                              });
                              fnfLimitCount[size]++
                            } else if (channelDecision == 2 && elmo1LimitCount[size] < elmo1SizeLimit[size]) {
                              elmo1Carts.push({
                                embed
                              });
                              elmo1LimitCount[size]++
                            } else if (channelDecision == 3 && elmo2LimitCount[size] < elmo2SizeLimit[size]) {
                              elmo2Carts.push({
                                embed
                              });
                              elmo2LimitCount[size]++
                            } else if (channelDecision == 4 && elmo3LimitCount[size] < elmo3SizeLimit[size]) {
                              elmo3Carts.push({
                                embed
                              });
                              elmo3LimitCount[size]++
                            } else if (childSizes) {
                              childCarts.push({
                                 embed
                              });
                            } else if (size < 7) {
                              baeCarts.push({
                                embed
                              });
                            } else {
                             regularCarts.push({
                                embed
                             });
                            }

                            if (channelDecision < 5) {
                              channelDecision++
                            } else {
                              channelDecision = 1
                            }

                            liveTotal = cartNum - redeemedTotal.length;
                            mainWindow.webContents.send('liveTotal', liveTotal);;
                            mainWindow.webContents.send('redeemedTotal', redeemedTotal.length);
                            mainWindow.webContents.send('cartsTotal', cartNum);
                            writeCart(cartNum, email, pass, loginURL, img, size, sku)
                            saveStats(cartNum, redeemedTotal.length)

                          } else if (e.footer.text === 'AdiSplash by Backdoor, All Rights Reserved.') {
                            size = (e.fields)[1]['value']
                            userPass = (e.fields)[2]['value']
                            email = (userPass).split(': ')[1].split('\n')[0]
                            pass = (userPass).split(': ')[2]

                            loginURL = e.url
                            sku = (e.fields)[0]['value']
                            img = 'https://transform.dis.commercecloud.salesforce.com/transform/aagl_prd/on/demandware.static/-/Sites-adidas-products/default/zoom/'+sku+'_00_plp_standard.jpg?sw=276&sh=276&sm=fit&strip=false'
                            //console.log('Size: ' + size)
                            //console.log('Email:Pass : ' + email + ':' + pass)
                            //console.log('Login link: ' + loginURL)
                            //console.log('Image: ' + img)

                            const embed = new Discord.RichEmbed()
                                .setColor(0x00FF00)
                                .setTimestamp()
                                .setDescription(`Size: ${size} \nSKU: ${sku}`)
                                .setFooter(`Cart: # ${cartNum} • Made by Jalfrazi`, 'https://pbs.twimg.com/profile_images/1088110085912649729/usJQewZx_400x400.jpg')
                                .setThumbnail(img);

                                // create random number to decide whether to go to private or yearly user
                                var channelRandom = Math.floor(Math.random() * 2) + 1;
                                Number(size);
                                if (channelDecision == 1 && fnfLimitCount[size] < fnfSizeLimit[size]) {
                                  fnfCarts.push({
                                    embed
                                  });
                                  fnfLimitCount[size]++
                                } else if (channelDecision == 2 && elmo1LimitCount[size] < elmo1SizeLimit[size]) {
                                  elmo1Carts.push({
                                    embed
                                  });
                                  elmo1LimitCount[size]++
                                } else if (channelDecision == 3 && elmo2LimitCount[size] < elmo2SizeLimit[size]) {
                                  elmo2Carts.push({
                                    embed
                                  });
                                  elmo2LimitCount[size]++
                                } else if (channelDecision == 4 && elmo3LimitCount[size] < elmo3SizeLimit[size]) {
                                  elmo3Carts.push({
                                    embed
                                  });
                                  elmo3LimitCount[size]++
                                } else if (childSizes) {
                                  childCarts.push({
                                     embed
                                  });
                                } else if (size < 7) {
                                  baeCarts.push({
                                    embed
                                  });
                                } else {
                                 regularCarts.push({
                                    embed
                                 });
                                }

                                if (channelDecision < 5) {
                                  channelDecision++
                                } else {
                                  channelDecision = 1
                                }

                            liveTotal = cartNum - redeemedTotal.length;
                            mainWindow.webContents.send('liveTotal', liveTotal);;
                            mainWindow.webContents.send('redeemedTotal', redeemedTotal.length);
                            mainWindow.webContents.send('cartsTotal', cartNum);
                            writeCart(cartNum, email, pass, loginURL, img, size, sku)
                            saveStats(cartNum, redeemedTotal.length)
                        } else if (e.footer.text === 'Phantom') {
                                size = (e.fields)[1]['value']
                                userPass = (e.fields)[4]['value']
                                email = (userPass).split(':')[0]
                                pass = (userPass).split(':')[1]

                                loginURL = 'https://www.adidas.com/'
                                img = ''
                                sku = (e.fields)[0]['value']
                                //console.log('Size: ' + size)
                                //console.log('Email:Pass : ' + email + ':' + pass)
                                //console.log('Login link: ' + loginURL)
                                //console.log('Image: ' + img)

                                const embed = new Discord.RichEmbed()
                                    .setColor(0x00FF00)
                                    .setTimestamp()
                                    .setDescription(`Size: ${size} \nSKU: ${sku}`)
                                    .setFooter(`Cart: # ${cartNum} • Made by Jalfrazi`, 'https://pbs.twimg.com/profile_images/1088110085912649729/usJQewZx_400x400.jpg')
                                    .setThumbnail(img);

                                if (size < 6.5) {
                              baeCarts.push({
                                embed
                              });
                            } else {
                             regularCarts.push({
                                embed
                             });
                            }
                                liveTotal = cartNum - redeemedTotal.length;
                                mainWindow.webContents.send('liveTotal', liveTotal);
                                mainWindow.webContents.send('redeemedTotal', redeemedTotal.length);
                                mainWindow.webContents.send('cartsTotal', cartNum);
                                writeCart(cartNum, email, pass, loginURL, img, size, sku)

                        } else if ((e.footer.text).startsWith('NoMercy')) {
                            size = (e.fields)[1]['value'];
                            email = (e.fields)[3]['value'];
                            pass = (e.fields)[4]['value'];

                            loginURL = e.url;
                            img = e.thumbnail.url;
                            sku = (e.fields)[0]['value'];
                            //console.log('Size: ' + size);
                            //console.log('Email:Pass : ' + email + ':' + pass);
                            //console.log('Login link: ' + loginURL);
                            //console.log('Image: ' + img);
                            const embed = new Discord.RichEmbed()
                                .setColor(0x00FF00)
                                .setTimestamp()
                                .setDescription(`Size: ${size} \nSKU: ${sku}`)
                                .setFooter(`Cart: # ${cartNum} • Made by Jalfrazi`, 'https://pbs.twimg.com/profile_images/1088110085912649729/usJQewZx_400x400.jpg')
                                .setThumbnail(img);
                            if (size < 6.5) {
                              baeCarts.push({
                                embed
                              });
                            } else {
                             regularCarts.push({
                                embed
                             });
                            }
                            writeCart(cartNum, email, pass, loginURL, img, size, sku)
                        } else if (e.footer.text === 'Gen5 Adidas') {
                            size = (e.fields)[1]['value'];
                            email = (e.fields)[3]['value'];
                            pass = (e.fields)[4]['value'];
                            loginURL = e.url;
                            img = e.thumbnail.url;
                            sku = (e.fields)[0]['value'];
                            //console.log('Size: ' + size);
                            //console.log('Email:Pass : ' + email + ':' + pass);
                            //console.log('Login link: ' + loginURL);
                            //console.log('Image: ' + img);
                            const embed = new Discord.RichEmbed()
                                .setColor(0x00FF00)
                                .setTimestamp()
                                .setDescription(`Size: ${size} \nSKU: ${sku}`)
                                .setFooter(`Cart: # ${cartNum} • Made by Jalfrazi`, 'https://pbs.twimg.com/profile_images/1088110085912649729/usJQewZx_400x400.jpg')

                            if (size < 6.5) {
                              baeCarts.push({
                                embed
                              });
                            } else {
                             regularCarts.push({
                                embed
                             });
                            }

                            liveTotal = cartNum - redeemedTotal.length
                            mainWindow.webContents.send('liveTotal', liveTotal);
                            mainWindow.webContents.send('redeemedTotal', redeemedTotal.length)
                            mainWindow.webContents.send('cartsTotal', cartNum);
                            writeCart(cartNum, email, pass, loginURL, img, size, sku)

                        }
                    }
                })
            }
            if (message.channel.id == regularChannel || message.channel.id == baeChannel || message.channel.id == childChannel || message.channel.id == elmo1Channel || message.channel.id == elmo2Channel || message.channel.id == fnfChannel || message.channel.id == elmo3Channel) {
                message.react('🛒')
            }
    }catch(err){
        console.log(err)
    }
    })

    function sendCarts() {
        if (regularCarts.length > 0) {
            console.log('Posting cart to regular channel...')
            guild.channels.get(regularChannel).send(
                regularCarts.shift()
            );

        } else if (baeCarts.length > 0) {
            console.log('Posting cart to bae channel...')
            guild.channels.get(baeChannel).send(
                baeCarts.shift()
            );

        } else if (childCarts.length > 0) {
            console.log('Posting cart to kids/toddler channel...')
            guild.channels.get(childChannel).send(
                childCarts.shift()
            );

        } else if (elmo1Carts.length > 0) {
            console.log('Posting cart to elmo1 channel...')
            guild.channels.get(elmo1Channel).send(
                elmo1Carts.shift()
            );

        } else if (elmo2Carts.length > 0) {
            console.log('Posting cart to elmo2 channel...')
            guild.channels.get(elmo2Channel).send(
                elmo2Carts.shift()
            );

        } else if (fnfCarts.length > 0) {
            console.log('Posting cart to fnf channel...')
            guild.channels.get(fnfChannel).send(
                fnfCarts.shift()
            );

        } else if (elmo3Carts.length > 0) {
            console.log('Posting cart to elmo3 channel...')
            guild.channels.get(elmo3Channel).send(
                elmo3Carts.shift()
            );

        }
    }
    setInterval(sendCarts, 500)

    /* FOR 1 CART ONLY */
    redeemed = []
    /* FOR 1 CART ONLY */


    //cart cooldown
    let cooldownSeconds = cooldown*1000

    function getUserLimit(userid, user) {
      for (var limit in limitConfig) {
        if (limitConfig.hasOwnProperty(limit) && limit == userid) {
          console.log(`${user.username}#${user.discriminator} has a limit of ${limitConfig[limit]}`);
          return limitConfig[limit];
        }
      }
    }

    function saveStats(currentTotalCarts, currentRedeemedCarts) {
      let totalRedeemedCartsStat = stats.redeemedCarts + currentRedeemedCarts;
      let totalCartsStat = stats.totalCarts + currentTotalCarts;
      console.log(`Redeemed: ${totalRedeemedCartsStat} Total: ${totalCartsStat}`)
      let statsToPush = {
        "totalCarts": totalCartsStat,
        "redeemedCarts": totalRedeemedCartsStat
      }

      try {
        fs.writeFileSync('./stats.json', JSON.stringify(statsToPush));
      } catch (err) {
        console.log(err);
      }

      let consoleTotalCarts, consoleRedeemedCarts;

      guild.channels.get("577331065862225920").setName(`Total Carts: ${totalCartsStat}`).then().catch(console.error);
      guild.channels.get("577331125400109066").setName(`Total Redeemed: ${totalRedeemedCartsStat}`).catch(console.error);
    }

    bot.on('messageReactionAdd', (reaction, user) => {
        //console.log(redeemed)
        if (reaction.message.author.bot) {
            if (redeemedTotal.includes(reaction.message.id)){
                return
            }
            //ttt
            var UserID = Number(user.id);
            quantityCart = getUserLimit(UserID, user);
            /* FOR 1 CART ONLY */
            let redeemingUser;
            if ((redeemingUser = redeemed.find(element => element.userid == user.id))) {
                  if (redeemingUser.redeemedLast + cooldownSeconds > Date.now() ){
                      console.log(`${redeemingUser.name} still on cooldown`)
                      reaction.remove(user)
                      return
                  }
                if (redeemingUser.quantityCart == quantityCart) {
                    console.log(`${redeemingUser.name} at max carts`)
                    reaction.remove(user)
                    return
                }
            }
            /* FOR 1 CART ONLY */



            /* console.log(reaction.message.id); */
            if (reaction.message.channel.id == regularChannel || reaction.message.channel.id == baeChannel || reaction.message.channel.id == childChannel || reaction.message.channel.id == elmo1Channel || reaction.message.channel.id == elmo2Channel || reaction.message.channel.id == fnfChannel || reaction.message.channel.id == elmo3Channel) {
                //console.log('Reaction added; current count:', reaction.count);
                if (reaction.count == 2) {
                    (reaction.users).forEach(element => {
                        //console.log(element['username'])
                        //console.log('user ID: ' + element['id'])
                        cartID = (reaction.message.embeds[0].footer.text).split('# ')[1].split(' • M')[0]

                        for (i = 0; i < cartsStore.length; i++) {
                            if (cartsStore[i]['id'] == cartID){
                                if (element['bot'] != true) {
                                    if((after10 && (Date.now() - cartsStore[i]['time'] )<600000) || after10 == false){
                                        /* FOR 1 CART ONLY */
                                        if (quantityCart > 0) {
                                            if ((redeemingUser = redeemed.find(element => element.userid == user.id))) {
                                                if (redeemingUser.quantityCart < quantityCart) {
                                                    redeemingUser.quantityCart++
                                                    redeemingUser.redeemedLast = Date.now()
                                                }
                                            } else {
                                                redeemed.push({
                                                    userid: user.id,
                                                    name: user.username + '#' + user.discriminator,
                                                    quantityCart: 1,
                                                    redeemedLast: Date.now()
                                                })
                                            }
                                        }

                                        /* FOR N CART(s) */

                                        console.log(`------------------------`);
                                        console.log(`Size: ${cartsStore[i]['size']}`);
                                        console.log(user.username + '#' + user.discriminator + ' redeemed cart #' +  cartsStore[i]['id'] )
                                        console.log(`Email: ${cartsStore[i]['email']} Pass: ${cartsStore[i]['pass']}`);
                                        const embed = new Discord.RichEmbed()
                                            .setColor(0x00FF00)
                                            .setTimestamp()
                                            .setTitle(`Size: ${cartsStore[i]['size']}`)
                                            .setURL(cartsStore[i]['login'])
                                            .setDescription(`Email: ${cartsStore[i]['email']} \nPassword: ${cartsStore[i]['pass']}`)
                                            .setFooter(`Cart: # ${cartsStore[i]['id']} • Made by Jalfrazi`, 'https://pbs.twimg.com/profile_images/1088110085912649729/usJQewZx_400x400.jpg')
                                        if (cartsStore[i]['image'] != '') {
                                            embed.setThumbnail(cartsStore[i]['image'])
                                        }
                                        if (cartsStore[i]['sku'] != '') {
                                            embed.setDescription(`Email: ${cartsStore[i]['email']} \nPassword: ${cartsStore[i]['pass']} \nSKU: ${cartsStore[i]['sku']}`)
                                        }else if (cartsStore[i]['email'] != ''){
                                            embed.setDescription(`Email: ${cartsStore[i]['email']} \nPassword: ${cartsStore[i]['pass']}`)
                                        }

                                        guild.members.get(element['id']).send({
                                            embed
                                        });

                                        redeemedTotal.push(reaction.message.id);

                                        try{
                                            if(deleteAfterReact ==false){
                                                reaction.message.edit({embed:{color:0xFF0000,title:'REDEEMED by '+user.username + '#' + user.discriminator,timestamp:new Date(),url:reaction.message.embeds[0].url,description:reaction.message.embeds[0].description,thumbnail:{url:reaction.message.embeds[0].thumbnail.url},footer:{text: reaction.message.embeds[0].footer.text, icon_url: reaction.message.embeds[0].footer.iconURL}}})
                                            }
                                        }
                                        catch(err){
                                            console.log(err)
                                        }


                                        liveTotal = cartNum - redeemedTotal.length;
                                        console.log(`live: ${liveTotal}`);
                                        mainWindow.webContents.send('liveTotal', liveTotal);
                                        mainWindow.webContents.send('redeemedTotal', redeemedTotal.length);
                                        mainWindow.webContents.send('redeemedOutput',redeemed);
                                        console.log(`redeemed: ${redeemedTotal.length}`)
                                    }
                                    else if((Date.now() - cartsStore[i]['time'] )>600000){
                                        redeemedTotal.push(reaction.message.id);
                                        try{
                                            if(deleteAfterReact ==false){
                                                reaction.message.edit({embed:{color:0x36393F,title:'EXPIRED',timestamp:new Date(),url:reaction.message.embeds[0].url,description:reaction.message.embeds[0].description,thumbnail:{url:reaction.message.embeds[0].thumbnail.url},footer:{text: reaction.message.embeds[0].footer.text, icon_url: reaction.message.embeds[0].footer.iconURL}}})
                                            }
                                        }
                                        catch(err){
                                            console.log(err)
                                        }
                                    }
                                }
                            }
                        }
                    });
                    if (deleteAfterReact) {
                        reaction.message.delete()
                    }

                }
            }
        }
    });

    function writeCart(cartNum, email, pass, loginURL, img, size, sku) {
        liveTotal = cartNum - redeemedTotal.length;
        mainWindow.webContents.send('liveTotal', liveTotal);
        mainWindow.webContents.send('redeemedTotal', redeemedTotal.length);
        mainWindow.webContents.send('cartsTotal', cartNum);

        cartsStore.push({
            'id': (cartNum).toString(),
            'email': email,
            'pass': pass,
            'login': loginURL,
            'image': img,
            'size': size,
            'sku': sku,
            'time': Date.now()
        })
    }
})
