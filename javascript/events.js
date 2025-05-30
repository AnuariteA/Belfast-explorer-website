const events = [
    {
        title: "Belsonic Festival 2025",
        date: " 5 June 2025, 10:30 AM",
        location: "Ormeau Park, Ormeau Rd, Belfast BT7 3GG",
        tags: ["Music"],
        img: "images/Belsonic.jpg",
        description: "Open-air festival featuring a lineup of international artists.",
        price: "£40",
        basePrice: 40,
        seats: "Standing only"
    },
    {
        title: "AVA Festival 2025",
        date: "30 May 2025, 12:00 PM",
        location: "Titanic Slipways, Belfast",
        tags: ["Music"],
        img: "images/AVA.jpg",
        description: "This festival showcases electronic music and visual arts.",
        price: "£95",
        basePrice: 95,
        seats: "Standing only"
    },
    {
        title: "Candlelight: Tribute to Coldplay",
        date: "16 May 2025, 19:30 PM",
        location: "Central Church, Belfast",
        tags: ["Music"],
        img: "images/candlelight.jpg",
        description: "Live Coldplay tribute by candlelight in an intimate venue.",
        price: "£40",
        basePrice: 40,
        seats: "50 available"
    },
    {
        title: "Tina – The Tina Turner Musical",
        date: "24 May 2025, 2:30 PM",
        location: "Grand Opera House, Belfast",
        tags: ["Theatre"],
        img: "images/Tina-turner-musical.jpg",
        description: "The story of Tina Turner’s rise to stardom.",
        price: "£42",
        basePrice: 42,
        seats: "70 available"
    },
    {
        title: "Six the Musical",
        date: "10 June 2025, 8:00 PM",
        location: "Grand Opera House, Belfast",
        tags: ["Theatre"],
        img: "images/six-the-musical.jpg",
        description: "The six wives of Henry VIII retell history.",
        price: "£31",
        basePrice: 31,
        seats: "60 available"
    },
    {
        title: "The Importance of Being Earnest",
        date: "31 May 2025, 14:30 PM",
        location: "Lyric Theatre Belfast",
        tags: ["Theatre"],
        img: "images/earnest.jpg",
        description: "Oscar Wilde’s witty and timeless comedy.",
        price: "£20",
        basePrice: 20,
        seats: "90 available"
    },
    {
        title: "MWM Fest 2025",
        date: "14 August 2025, 11:30 AM",
        location: "Belfast",
        tags: ["Irish Dance"],
        img: "images/mwm-fest.jpg",
        description: "Workshops, Irish dance, and festival atmosphere.",
        price: "£20",
        basePrice: 20,
        seats: "Outdoor/Standing"
    },
    {
        title: "Intro to Irish Dance – The Deer`s Head Céilí",
        date: "14 May 2025, 11:30 AM",
        location: "The Deer's Head, Belfast",
        tags: ["Irish Dance"],
        img: "images/Event-recom2.jpg",
        description: "Try Irish dance in a fun and engaging experience.",
        price: "£10",
        basePrice: 10,
        seats: "40 available"
    },
    {
        title: "Van Gogh: The Immersive Experience – Belfast",
        date: "20 May 2025, 10:00 AM",
        location: "TBA, Belfast",
        tags: ["Exhibitions"],
        img: "images/van-gogh.jpg",
        description: "Step into Van Gogh’s artworks through VR walk and massive projections.",
        price: "£17",
        basePrice: 17,
        seats: "Flexible entry slots"
    },
    {
        title: "Lucian Freud Immersive Exhibition",
        date: "15 June 2025, 10:00 AM",
        location: "Titanic Belfast",
        tags: ["Exhibitions"],
        img: "images/Exhibitions.jpg",
        description: "A modern immersive exhibit of Freud’s art and life.",
        price: "£15",
        basePrice: 15,
        seats: "60 available"
    },
    {
        title: "Belfast XR Festival 2025",
        date: "13 June 2025, 12:00 PM",
        location: "Belfast",
        tags: ["Exhibitions"],
        img: "images/xr-festival.jpg",
        description: "Explore immersive storytelling and VR exhibitions.",
        price: "£12",
        basePrice: 12,
        seats: "100 available"
    }
];
window.events = events;
localStorage.setItem("events", JSON.stringify(events));
