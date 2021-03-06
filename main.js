'use strict';
const repl = require('repl');
const Discord = require('discord.js');
const client = new Discord.Client();
const { spawn, execFile } = require('child_process');
const _ = require('underscore');
var sz = true;
var aggrsz = true;
var timeout = 50000;
var aggrtimeout = 10000;
var self = 'BrewBot';
if (process.argv[3] == 'f'){
	  sz = false;
	  console.log('sanitization turned off');
}
if (process.argv[4] == 'f'){
	  aggrsz = false;
	  console.log('aggressive sanitization turned off');
}
console.log(process.argv[3]); //TODO debug

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setPresence({game: {name: 'with my dev\'s heart'}, status: 'busy'});
});

client.on('message', msg => {
    if (msg.content === 'ping') {
        msg.reply('pong');
        msg.channel.send('pang');
    }

    //BOT SANITIZATION
    if(msg.author.bot === true){
	      if(aggrsz === true && !(msg.author.username === self)){
		        sanitize(msg, aggrtimeout);
		        msg.channel.send("```Aggressive sanitization is enabled. \nI will delete the above bot message in "+aggrtimeout/1000+" seconds.\nThis can be disabled by the dev in settings if this is a problem.```");
	      }
	      if(msg.author.username === self){  //TODO laying framework for reaction based stuff
		        sanitize(msg, timeout);
	      }



    }



    if (msg.content.startsWith('^')){
	      if(sz){
		        sanitize(msg, timeout);
		        msg.channel.send("```Be aware that sanitization is on and these messages will be deleted in "+timeout/1000+" seconds. Please contact the dev if you have any questions or would like to increase the time these messages stay here.```");
	      }

//	      var procUsrIn = new Promise(()=>{return msg.content.substring(1).split(" ")}).catch(e){return msg.content.substring(1); console.log('someone passed without args')};
        var procUsrIn = (msg.content.substring(1)+' ').split(' ');
	      var response = (raw, msg) => {
		        console.log(raw[0]);
		        switch (raw[0]){
            case 'dm':
                var dm = msg.author.createDM().then((a)=>{
                    a.send('hi! ;)');
                }).catch(console.error);
                return 'echo done!';
            case 'mu':
            case 'music':
                const ytdl = require('ytdl-core');
                const streamOptions = { seek: 0, volume: 1 };
                const broadcast = client.createVoiceBroadcast();
                const voiceChannel = msg.member.voiceChannel;
                //        console.log(msg.author.member.GuildMember.voiceChannel);
                //        console.log(msg.author.lastMessage.member.GuildMember.voiceChannel);
                //        var test = util.inspect(msg.author.lastMessage.member.voiceChannel);
//                var link = 'https://www.youtube.com/watch?v=TrRDqD-bpWY';
                try{
                    voiceChannel.join().then(connection => {
                        const stream = ytdl(raw[1], { filter : 'audioonly' });
                        broadcast.playStream(stream);
                        //broadcast.playFile("./yas.mp4");
                        const dispatcher = connection.playBroadcast(broadcast);
                    }).catch(console.error);
                }catch(e){
                    msg.channel.send('you\'re not in a channel you retard');
                }
                return "echo _SUCTION!_";
			      case 'cr':
			      case 'curse':
				        return "node curse.js";
			      case 'tg':
			      case 'tungsten':
				        return "tungsten " + raw.slice(1).join(" ");
			      case 'help':
				        return "cat help.txt";
			      case 'mention':
			      case 'mn':
				        return "echo the following users have been mentioned in this message: "+ msg.mentions.users.array();
			      case 'lobby':
			      case 'lb':
				        return "echo **UNFULFILLED REQUEST** \n follwing users are being waited on: "+msg.mentions.users.array()+" by "+ msg.author+"```TO DISMISS THIS MESSAGE MENTIONED USERS CLICK THE EMOJI SIGNALLING THEIR PRESENCE\nTHIS MESSAGE WILL SELF DESTRUCT IN A HOUR```";
			      case 'rr':
				        return "echo this command is currently under development, check back later or pester the dev";
			      case 'sz':
				        return "echo sanitization is "+sz+" and aggressive sanitization is "+aggrsz+ ". Timeout is "+timeout/1000+" seconds.";
			      default:
				        return "echo This command is not defined, check your spelling";
		        }
	      };

	      var format = response(procUsrIn, msg).split(" ");
	      console.log(response);
	      var ls = spawn(format[0], format.slice(1));
	      ls.stdout.on('data', data => {
		        console.log(`stdout: ${data}`);
		        msg.channel.send(`${data}`);
	      });
	      ls.stderr.on('data', data => {
		        console.log(`stderr: ${data}`);
		        msg.channel.send(`stderr: ${data}`);
	      });
        /*	ls.on('close', code => {
		        console.log(`child process exited with code ${code}`);
		        msg.reply(`child process exited with code ${code}`);
	          }); */

    }







    if (msg.content.startsWith(',')){
	      var procUsrIn = msg.content.substring(1).split(" ");
	      var ls = spawn(procUsrIn[0], procUsrIn.slice(1));
	      ls.stdout.on('data', data => {
		        console.log(`stdout: ${data}`);
		        msg.channel.send(`${data}`);
	      });
	      ls.stderr.on('data', data => {
		        console.log(`stderr: ${data}`);
		        msg.channel.send(`stderr: ${data}`);
	      });
	      ls.on('close', code => {
		        console.log(`child process exited with code ${code}`);
		        msg.channel.send(`child process exited with code ${code}`);
	      });
    }
});


function sanitize(message, time){
	  if (sz === true && !(message.content.startsWith('**UNFULFILLED REQUEST**'))){
		    message.delete(time).catch(console.log("message was already deleted lol"));
	  }
	  if(message.content.startsWith('**UNFULFILLED REQUEST**')){
		    message.delete(360000);
		    message.react("1⃣").catch(function(){
			      console.log("got an issue with the emoji");
		    });
        //		const filter = (reaction, user, approved, creator) => reaction.emoji.name == "1⃣" && (user.id == approved || user.id == creator);
        //		message.awaitReactions(filter(message.mentions.users.array(), message.author), {time:1200000}).then(message.delete(2000)).catch(console.error);

		    var reactors = [];
		    message.awaitReactions((reaction, user) => {
			      reactors.push(user);
			      console.log("reactors: "+ reactors);
			      console.log("mentioneds: "+ message.mentions.users.array());
			      if(_.difference(message.mentions.users.array(), reactors).length === 0 && reaction){
				        message.delete(timeout);
				        message.channel.send("**REQUEST FULFILLED**\n"+message.mentions.users.array() + "\n```Requested users are active\nRequest has been fulfilled. Have a nice day!```");
			      }
		    });
	  }

}
client.login(process.argv[2]);
