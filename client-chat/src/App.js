import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import io from "socket.io-client";

const Page = styled.div`
  max-width: 100%;
  width: 100%;
  height: 100%;
`;
const Container = styled.div`
  width: 50%;
  height: 50%;
  margin: 0 auto;
  border-radius: 20px;
  border: 1px solid black;
  display: grid;
  grid-template-columns: auto;
`;
const Mymessage = styled.div`
  background-color: blue;
  color: white;
`;
const OtherMessage = styled.div`
  background-color: white;
  color: blacl;
`;

const Form = styled.form`
  width: 50%;
  height: 20%;
  margin: 0 auto;
`;
const App = () => {
  const [id, SetId] = useState();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const socketRef = useRef();
  useEffect(() => {
    socketRef.current = io.connect("/"); // -> this will connect to the proxy
    socketRef.current.on("Your id", (id) => {
      console.log(id);
      SetId(id);
    });
    socketRef.current.on("message", (message) => {
      handleMessageReceiver(message);
    });
  }, []);
  const handleMessageReceiver = (message) => {
    setMessages((oldMsgs) => [...oldMsgs, message]);
  };
  const handleSendMessage = (e) => {
    e.preventDefault();
    const messageObject = {
      body: message,
      id: id,
    };
    setMessage("");
    console.log(messageObject);
    socketRef.current.emit("send message", messageObject);
  };
  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <Page>
      <Container>
        {messages.map((message) => {
          if (message.id === id) {
            return <Mymessage>{message.body}</Mymessage>;
          } else {
            return <OtherMessage>{message.body}</OtherMessage>;
          }
        })}
      </Container>
      <Form onSubmit={handleSendMessage}>
        <input
          value={message}
          onChange={handleChange}
          placeholder="message goes here"
        ></input>
        <button>Send</button>
      </Form>
    </Page>
  );
};

export default App;
