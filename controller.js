const mqtt = require('mqtt')

const client = mqtt.connect('mqtt://broker.hivemq.com')

var garageState = ''

var connected = false

client.on('connect', ()=>{
    client.subscribe('garage/connected')
    client.subscribe('garage/state')
})

client.on('message', (topic, message) =>{
    // if(topic === 'garage/connected'){
    //     connected = (message.toString() === 'true')
    // }
    switch(topic){
        case 'garage/connected':
            return handleGarageConnected(message)
        case 'garage/state':
            return handleGarageState(message)
    }
    console.log('No handler for topic %s', topic)
})

function handleGarageConnected(message){
    console.log('garage connected status %s', message)
    connected = (message.toString() === 'true')
}

function handleGarageState(message){
    garageState = message
    console.log('garage state update to %s', message)
}

function openGarageDoor(){
    if(connected && garageState !== 'open'){
        client.publish('garage/open', 'true') // ask to open door if connected to mqtt and door isn't already open
    }
}

function closeGarageDoor(){
    if(connected && garageState !== 'close'){
        client.publish('garage/close', 'true') // ask to close door if connected to mqtt and door isn't already close
    }
}


// testing door open/close

setTimeout(()=>{
    console.log('open door')
    openGarageDoor()
}, 5000)


setTimeout(()=>{
    console.log('close door')
    closeGarageDoor()
}, 20000)