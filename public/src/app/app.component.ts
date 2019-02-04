import { Component, OnInit } from '@angular/core';
import { HttpService } from './http.service';
import * as io from 'socket.io-client';


declare var editor: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  socket;
  curr_user: any;
  user_list: any;
  messages: any;
  all_messages: any;

  constructor(private _httpService: HttpService) {
  }

  ngOnInit() {
    console.log('hello')
    this.socket = io()

    this.curr_user =
      {
        name: prompt('what is your name'),
      }
    this.messages = {
      name: this.curr_user.name,
      message: "wassup my ninjas!"
    }

    this.socket.emit('new_user', this.curr_user);

    this.socket.on('allusers', (data) => {
      console.log('data----', data)
      this.user_list = data
    })
    this.socket.on('allMessages', (data) => {
      console.log('in .on of getMessage-------')
      console.log('all messages', data)
      this.all_messages = data
    })

    this.getMessage();

  }// end of ngOnInit

  // Get all messages from server
  getMessage() {
    console.log('get messages method')
    this.socket.emit('sendMessage', this.messages)
    this.messages = {
      name: this.curr_user.name,
      message: ""
    }
  }

}


