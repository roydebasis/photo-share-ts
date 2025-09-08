import EventEmitter from "events";

const regEvent = new EventEmitter();

regEvent.on("accountOpened", (data) => {
  console.log("registration email data: ", data);
  //write code hreer
});

regEvent.on("error", (err) => {
  console.log("error: ", err);
});

// console.log("Listening for accountOpened events....");
// console.log(
//   "Listeners for accountOpened events: ",
//   regEvent.listenerCount("accountOpened")
// );

// console.log(
//   "Max. Listeners for accountOpened events: ",
//   regEvent.getMaxListeners()
// );

export default regEvent;
