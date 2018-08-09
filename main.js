'use strict';
const Discord = require('discord.js');
const client = new Discord.Client();
const { spawn, execFile } = require('child_process');
var sz = true;
var aggrsz = true;
var timeout = 5000;
var aggrtimeout = 10000;
var self = 'BrewBot';


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
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
	if(msg.author.username === self && !(msg.content.startsWith("**TIMED MESSAGE**"))){  //TODO laying framework for reaction based stuff
		sanitize(msg, timeout);
	}
  }









  if (msg.content.startsWith('^')){
	if(sz){
		sanitize(msg, timeout);
		msg.channel.send("```Be aware that sanitization is on and these messages will be deleted in "+timeout/1000+" seconds. Please contact the dev if you have any questions or would like to increase the time these messages stay here.```");
	}

	var procUsrIn = msg.content.substring(1).split(" ");
	var response = (raw) => {
		console.log(raw[0]);
		switch (raw[0]){
			case 'cr':
			case 'curse':
				return "node curse.js";
			case 'tg':
			case 'tungsten':
				return "tungsten " + raw.slice(1).join(" ");
			case 'help':
				return "cat help.txt"
			case 'rr':
				return "echo this command is currently under development, check back later or pester the dev";
			case 'sz':
				return "echo sanitization is "+sz+" and aggressive sanitization is "+aggrsz+ ". Timeout is "+timeout/1000+" seconds.";
			default:
				return "echo This command is not defined, check your spelling";
		}
	}
	console.log(response(procUsrIn));
	var format = response(procUsrIn).split(" ");
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
	if (sz === true){
		message.delete(time);
	}
}
client.login(process.argv[2]);
