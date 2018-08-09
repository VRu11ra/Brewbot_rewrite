'use strict';
const Discord = require('discord.js');
const client = new Discord.Client();
const { spawn, execFile } = require('child_process');


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.reply('pong');
  }
/*  if (msg.content.startsWith('^')){
	var em = execFile(msg.content.substring(1)); //TODO problems here with getting data back
	em.stdout.on('data', data => {
		console.log(`stdout: ${data}`);
		msg.reply(`stdout: ${data}`);
	});
	em.stderr.on('data', data => {
		console.log(`stderr: ${data}`);
		msg.reply(`stderr: ${data}`);
	});
	em.on('close', code => {
		console.log(`child process exited with code ${code}`);
		msg.reply(`child process exited with code ${code}`);
	});

  
  } */

  if (msg.content.startsWith('^')){
	var procUsrIn = msg.content.substring(1).split(" ");
	var response = (raw) => {
		console.log(raw[0]);
		switch (raw[0]){
			case 'curse':
				return "node curse.js";
			case 'tg':
				return "tungsten " + raw.slice(1).join(" "); //THIS MIGHT BE WEIRD GIVEN RAW IS AN ARRAY
			default:
				return "echo \"This command is not defined, check your spelling\"";
		}
	}
	console.log(response(procUsrIn));
	var format = response(procUsrIn).split(" ");

	var ls = spawn(format[0], format.slice(1));
	//var ls = spawn(response(procUsrIn));
	ls.stdout.on('data', data => {
		console.log(`stdout: ${data}`);
		msg.reply(`${data}`);
	});
	ls.stderr.on('data', data => {
		console.log(`stderr: ${data}`);
		msg.reply(`stderr: ${data}`);
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
		msg.reply(`stdout: ${data}`);
	});
	ls.stderr.on('data', data => {
		console.log(`stderr: ${data}`);
		msg.reply(`stderr: ${data}`);
	});
	ls.on('close', code => {
		console.log(`child process exited with code ${code}`);
		msg.reply(`child process exited with code ${code}`);
	});
  }
});

client.login(process.argv[2]);
