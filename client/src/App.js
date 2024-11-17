import React, { Component } from 'react';
import openSocket from 'socket.io-client';
import "./App.css";
import DOMPurify from "dompurify";

const socket = openSocket('http://localhost:3001');

class App extends Component {
    constructor(props) {
        const today = new Date();
        const time = today.getHours() + ':' + today.getMinutes();
      
        super(props);
        this.state = {
            channelSelected: '#accueil',
            username: 'invité',
            usertemp: '',
            temp: '',
            tempMessage: '',
            time: time,
            channels: ['#accueil'],
            messages: [],
            users: [],
            connected: false,
            newChannel: ''
        };

        this.handlePseudo = this.handlePseudo.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleMessage = this.handleMessage.bind(this);
        this.handleDisconnect = this.handleDisconnect.bind(this);
        this.handleChannelChange = this.handleChannelChange.bind(this);
        this.handleNewChannel = this.handleNewChannel.bind(this);
        this.onChange = this.onChange.bind(this);
        this.Channel = this.Channel.bind(this);
        this.Message = this.Message.bind(this);
        this.affichageMenbre = this.affichageMenbre.bind(this);
    }

    componentDidMount() {
        socket.on('messageHistory', (history) => {
            if (history) {
                const allMessages = [];
                Object.values(history).forEach(channelMessages => {
                    allMessages.push(...channelMessages);
                });
                this.setState({ messages: allMessages });
            }
        });

        socket.on('newuser', (user) => {
            this.setState(prevState => ({
                messages: [...prevState.messages, {
                    channel: this.state.channelSelected,
                    author: 'system',
                    content: `${user.username} a rejoint le channel`,
                    time: this.state.time,
                    chucho: 'no'
                }]
            }));
        });

        socket.on('disuser', (user) => {
            this.setState(prevState => ({
                messages: [...prevState.messages, {
                    channel: this.state.channelSelected,
                    author: 'system',
                    content: `${user.username} a quitté le channel`,
                    time: this.state.time,
                    chucho: 'no'
                }]
            }));
        });

        socket.on('newmsg', (message) => {
            this.setState(prevState => ({
                messages: [...prevState.messages, {
                    channel: message.channel,
                    author: message.author,
                    content: message.content,
                    to: message.to,
                    time: message.time,
                    chucho: message.chucho
                }]
            }));
        });

        socket.on('listUsers', (users) => {
            this.setState({ users });
        });

        socket.on('listChannels', (channels) => {
            this.setState({ channels });
        });
    }

    handleDisconnect() {
        socket.disconnect();
        this.setState({
            username: 'invité',
            messages: [],
            users: [],
            connected: false
        });
    }

    handlePseudo(event) {
        event.preventDefault();
        if (this.state.usertemp) {
            socket.emit('login', { username: this.state.usertemp });
            this.setState({ 
                username: this.state.usertemp,
                connected: true 
            });
        }
    }

    handleMessage(event) {
        event.preventDefault();
        if (this.state.temp) {
            const newMessage = {
                channel: this.state.channelSelected,
                author: this.state.username,
                content: this.state.temp,
                time: this.state.time,
                chucho: 'no'
            };
            
            socket.emit('newmessage', { messages: newMessage });
            this.setState(prevState => ({
                messages: [...prevState.messages, newMessage],
                temp: ''
            }));
        }
    }

    handleChange(event) {
        this.setState({ temp: event.target.value });
    }

    handleChannelChange(event) {
        this.setState({ newChannel: event.target.value });
    }

    handleNewChannel(event) {
        event.preventDefault();
        if (this.state.newChannel) {
            socket.emit('newChannel', { channel: this.state.newChannel });
            this.setState({ newChannel: '' });
        }
    }

    onChange(event) {
        this.setState({ usertemp: event.target.value });
    }

    Channel() {
        return this.state.channels.map(channel => (
            <button 
                key={channel}
                onClick={() => this.setState({ channelSelected: channel })}
            >
                - {channel}
            </button>
        ));
    }

    Message() {
        const filteredMessages = this.state.messages.filter(
            msg => msg.channel === this.state.channelSelected
        );

        return filteredMessages.map((msg, index) => (
            <div key={index}>
                <b>{msg.author}</b>: {msg.content}
            </div>
        ));
    }

    affichageMenbre() {
        return this.state.users.map((user, index) => (
            <div key={index}>
                {user}
            </div>
        ));
    }

    render() {
        if (this.state.username === 'invité') {
            return (
                <div className="flex justify-center text-center p-5 solid">
                    <div className="username">
                        <h1>Bienvenue sur My_IRC</h1>
                        <div className="p-8">
                            <span className="label">
                                Votre pseudo :
                            </span>
                        </div>

                        <form onSubmit={this.handlePseudo}>
                            <input className='text-sm sm:text-base text-center relative w-full border rounded placeholder-gray-400 focus:border-indigo-400 focus:outline-none py-2 texs' type="text" onChange={this.onChange}/>
                            <button className="button" type="submit">Se connecter</button>
                        </form>
                    </div>
                </div>
            )
        }

        return (
            <div>
                <button onClick={this.handleDisconnect}>Déconnexion</button>
                <div className="App">
                    <div className="flex justify-center py-5">
                        <div className="max-w-sm bg-white border-2 border-gray-300 p-6 rounded-md tracking-wide shadow-lg">
                            <div className="rounded text-center relative -mb-px  px-8">
                                liste des channels ( cliquez pour changer de channel )  <br/>
                                {this.Channel()} <br/>
                            </div>
                            <div className="text-center">
                                <form onSubmit={this.handleNewChannel}> 
                                    <input className='text-sm sm:text-base text-center relative w-full border rounded placeholder-gray-400 focus:border-indigo-400 focus:outline-none py-2 pr-2' type="text" placeholder='cree un nouveau channel ' onChange={this.handleChannelChange}/>
                                    <button type="submit">Envoyer</button>
                                </form>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center rounded-lg  p-16 test">
                        <div className="text-center name">
                            <em>Bienvenue { this.state.username } sur le channel {this.state.channelSelected}</em>
                        </div> 
                        <div className="grid place-items-center w-4/5 mx-auto p-10 my-20 sm:my-auto bg-gray-50 border rounded-xl shadow-2xl space-y-5 text-center affiche">
                            <div>   
                                <div id="content">
                                    {this.Message()}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center bas">
                            <span className="border rounded-lg">
                                <div className="sendForm">
                                    <form onSubmit={this.handleMessage}>
                                        <input className="" id="msg" value={this.state.temp} onChange={ this.handleChange }/>
                                        <button className="inline-block px-6 py-2 text-xs font-medium leading-6 text-center text-white uppercase transition bg-gray-300 rounded-full shadow ripple waves-light hover:shadow-lg focus:outline-none hover:bg-black" type="submit">Envoyer</button>
                                    </form>
                                </div>
                            </span>
                        </div>
                    </div>
                    <div className="bg-grey-200">
                        <footer className="flex flex-wrap items-center justify-between p-3 m-auto">
                            <div className="container mx-auto flex flex-col flex-wrap items-center justify-between">
                                <div className="members">
                                    Liste des membres
                                    {this.affichageMenbre()}
                                </div>
                            </div>
                        </footer>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;