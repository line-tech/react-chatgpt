import { Novu } from "@novu/node";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
//... other code statement
app.get("/subscribers", async (req, res) => {
    try{
        const {data} = await Novu.subscribers.list(0);
        const resultData = data.data;
        // returns subscriber with an id and first and last names
        const subscriber = resultData.filter(
            (d) => d.firstName && d.lastName && d.subscriberID
        );
        res.json(subscribers);
        
    } catch (err) {
        console.error(err)
    }
});

// state representing the list of subscribers
const [subscriber, setsubscriber] = useState([
    { firstName:"", lastName:"", subscriberID:"select", _id:"null"},
]);

//fetch the lis of subscribers on page load 
useEffect(() => {
    async function fetchSubscribers() {
        try {
            const request = await fetch("http://localhos:4000/subscribers");
            const response = await request.json();
            setsubscriber([...subscribers, ...response]);
        } catch (err) {
            console.error(err);
        }
    }
    fetchSubscribers();
}, []); 

app.post("/notify", (req, res) =>{
    //Destructure the message and subscriber from the project
    const { message, subscriber } = req.body;
    // separates the first name and the subscriber
    const subscriberDetails = subscriber.split(" ");
    const firstName = subscriberDetails[0];
    const subscriberID = subscriberDetails[3];
    // Added some specification to the message to enable AI generate a concise notification
    const fullMessage = 'I have a notification system and I want to send the user a notification about "${message}" can you write me one?    please use double curly brackets for variables.  make it short, and use only one variable for the user name. Please just write 1 notification without any intro.'
        //log the required variables to the console
        console.log({ firstName, subscriberID, fullMessage});
}

)
//👇🏻 Makes the POST request
async function sendNotification() {
    try {
        const request = await fetch("http://localhost:4000/notify", {
            method: "POST",
            body: JSON.stringify({
                message,
                subscriber,
            }),
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });
        const data = await request.json();
        console.log(data);
    } catch (err) {
        console.error(err);
    }
}

//👇🏻 Runs when a user submits the form
const handleSubmit = (e) => {
    e.preventDefault();
    //👇🏻 Calls the function
    sendNotification();
    setMessage("");
    setSubscriber("");
};

app.post("/notify", (req, res) => {
    const { message, subscriber } = req.body;
    const subscriberDetails = subscriber.split(" ");
    const firstName = subscriberDetails[0];
    const subscriberId = subscriberDetails[3];
    const fullMessage = `I have a notification system and I want to send the user a notification about "${message}" can you write me one?
please use double curly brackets for variables.
make it short, and use only one variable for the user name.
Please just write 1 notification without any intro.`;
    console.log({ firstName, subscriberId, fullMessage });

    //👇🏻 Pass the variables as a parameter into the function
    chatgptFunction(fullMessage, subscriberId, firstName, res);
});
//👇🏻 Holds the AI-generated notification
let chatgptResult = "";

async function chatgptFunction(message, subscriberId, firstName, res) {
    // use puppeteer to bypass cloudflare (headful because of captchas)
    const api = new ChatGPTAPIBrowser({
        email: "<YOUR_CHATGPT_EMAIL>",
        password: "<YOUR_CHATGPT_PASSWORD>",
    });
    //👇🏻 Open up the login screen on the browser
    await api.initSession();
    const result = await api.sendMessage(message);
    chatgptResult = result.response;
    //👇🏻 Replace the user variable with the user's first name
    const notificationString = chatgptResult.replace("{{user}}", firstName);

    console.log(notificationString, subscriberId);
}
async function chatgptFunction(message, subscriberId, firstName, res) {
    // use puppeteer to bypass cloudflare (headful because of captchas)
    const api = new ChatGPTAPIBrowser({
        email: "<YOUR_CHATGPT_EMAIL>",
        password: "<YOUR_CHATGPT_PASSWORD>",
    });
    await api.initSession();
    const result = await api.sendMessage(message);
    chatgptResult = result.response;
    const notificationString = chatgptResult.replace("{{user}}", firstName);

    //👇🏻 Pass the necessary variables as parameters
    sendNotification(notificationString, subscriberId, res);
}

//👇🏻 Sends the notification via Novu
async function sendNotification(data, subscriberId, res) {
    try {
        let result = await novu.trigger("<NOTIFICATION_TEMPLATE_ID>", {
            to: {
                subscriberId: subscriberId,
            },
            payload: {
                message: data,
            },
        });
        return res.json({ message: result });
    } catch (err) {
        return res.json({ error_message: err });
    }
}