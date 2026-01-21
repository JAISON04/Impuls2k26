// Import Event Images
import paperPres from '../assets/images/paper presentation.png';
import projectPres from '../assets/images/imageposter.png';
import circuitDebug from '../assets/images/imagecircuit.png';
import wiring from '../assets/images/imagewiring.png';
import connections from '../assets/images/imageconnection.png';
import techQuiz from '../assets/images/imagequiz.png';
import ecad from '../assets/images/cad.avif';
import photo from '../assets/images/imagephotpo.png'; // For Photography
import posterDesign from '../assets/images/imageposter.png'; // Reusing for Poster Design
import aiVideo from '../assets/images/imagevideo.png'; // Reusing for AI Video
import lastLogin from '../assets/images/imageentre.png'; // Placeholder
import electrolink from '../assets/images/electrolink.png';
import blackout from '../assets/images/blackout_files.jpg'; // Updated image

// Import Workshop Images
import iot from '../assets/images/imageiot.png';
import ev from '../assets/images/imageev.png';
import renewable from '../assets/images/imagerenewable.png';
import kuka from '../assets/images/imagekuka.png';
import entrepreneurship from '../assets/images/imageentre.png'; // Reusing for MicroSaaS
import astronomy from '../assets/images/imageentre.png'; // Reusing for Astronomy
import videoEdit from '../assets/images/imagevideo.png';
import startup from '../assets/images/imagestartuppitch.png'; // Alternative for MicroSaaS

export const eventsData = {
    technical: [
        {
            id: 1,
            title: 'Circuit Debugging',
            image: circuitDebug,
            desc: 'Find the faults and fix the circuits.',
            details: 'Test your electronics skills by identifying and fixing faults in complex circuits within a time limit. A challenge for the sharpest minds in circuitry.',
            coordinators: [
                { name: 'Madan Prakash K S', contact: '98402 15374' },
                { name: 'Pragadhiswari P', contact: '70109 43319' },
            ],
            rules: [
                'Individual participation or team of 2.',
                'Debugging tools will be provided.',
                'Time limit: 45 minutes.',
                'Judges decision is final.'
            ],
            price: 50,
            isTeamEvent: true,
            minTeamSize: 1,
            maxTeamSize: 2
        },
        {
            id: 2,
            title: 'Wiring Challenge',
            image: wiring,
            desc: 'Master the art of electrical connections.',
            details: 'A competition to test your speed and accuracy in electrical wiring and circuit connections. Precision and safety are key.',
            coordinators: [
                { name: 'Dharshini R', contact: '63833 45731' },
                { name: 'Divainy J', contact: '80725 13973' }
            ],
            rules: [

                'Safety gear (gloves) must be worn.',
                'Circuit diagram will be provided.',
                'Judges decision is final.'
            ],
            price: 50,
            isTeamEvent: false,
            minTeamSize: 1,
            maxTeamSize: 1
        },
        {
            id: 3,
            title: 'Technical Quiz',
            image: techQuiz,
            desc: 'Test your technical knowledge.',
            details: 'Battle of brains! Answer technical questions and prove your expertise in various engineering domains. From basics to advanced concepts.',
            coordinators: [
                { name: "Kishore R", contact: "63699 02036" },
                { name: 'Vimal Dheep AL', contact: '96297 91556' }
            ],
            rules: [
                'Team of 3 members.',
                'No electronic gadgets allowed.',
                'Quiz specific rules will be announced on spot.',
                'Judges decision is final.'
            ],
            price: 50,
            isTeamEvent: true,
            minTeamSize: 1,
            maxTeamSize: 3
        },
        {
            id: 4,
            title: 'Paper Presentation',
            image: paperPres,
            desc: 'Showcase your innovative ideas and research.',
            details: 'Present your technical papers on cutting-edge technologies. A platform to share knowledge, innovations, and research findings with a panel of experts.',
            coordinators: [
                { name: 'J Jerauld Alwin', contact: '94983 50881' },
                { name: 'Jaya Sudha S', contact: '63827 55248' },

            ],
            rules: [
                'Maximum 3 members per team.',
                'Abstract must be submitted before the deadline.',
                'Presentation time: 7 mins + 3 mins Q&A.',
                'Judges decision is final.'
            ],
            price: 50,
            isTeamEvent: true,
            minTeamSize: 1,
            maxTeamSize: 3
        },
        {
            id: 5,
            title: 'Project Presentation',
            image: projectPres,
            desc: 'Visualise your technical concepts creatively.',
            details: 'Demonstrate your engineering projects and prototypes. Impress the judges with your practical implementation and innovative solutions.',
            coordinators: [
                { name: 'Sudharsan S', contact: '80500 24271' },
                { name: 'Theeran K', contact: '96260 72477' }
            ],
            rules: [
                'Maximum 3 members per team.',
                'Working prototype is mandatory.',
                'Presentation time: 7 mins + 3 mins Q&A.',
                'Judges decision is final.'
            ],
            price: 50,
            isTeamEvent: true,
            minTeamSize: 1,
            maxTeamSize: 3
        },
        {
            id: 6,
            title: 'E-Cadathon',
            image: ecad,
            desc: 'Design complex electrical systems.',
            details: 'Showcase your CAD skills by designing electrical layouts and systems efficiently using industry-standard software.',
            coordinators: [
                { name: 'Bragadeeswaran B', contact: '90428 51602' },
                { name: "Mathivanan V", contact: "93636 14486" }
            ],
            rules: [
                'Time duration: 1 hour 30 minutes.',
                'Software not provided (Bring your own laptop).',
                'Only KiCad software is allowed.',
                'Judges decision is final.'
            ],
            price: 100,
            isTeamEvent: true,
            isFixedPrice: true,
            minTeamSize: 1,
            maxTeamSize: 3,
            externalUrl: 'https://unstop.com/competitions/e-cadathon-impulse-2026-chennai-institute-of-technology-1621391'
        },
        {
            id: 7,
            title: 'Last Login',
            image: lastLogin,
            desc: 'Unlock the digital mysteries.',
            details: 'Hosted by Club Celestius. A challenge of logic, coding, and problem-solving. Can you crack the code before time runs out?',
            club: 'Club Celestius',
            coordinators: [
                { name: "Rudra Prasad M L", contact: "80720 29917" }
            ],
            rules: [
                'Team of 2 members.',
                'Laptop required.',
                'Judges decision is final.'
            ],
            price: 50,
            isTeamEvent: true,
            minTeamSize: 1,
            maxTeamSize: 2
        },
        {
            id: 8,
            title: 'Electrolink',
            image: electrolink,
            desc: 'Forge the connections.',
            details: 'Participants will be given images as clues and must observe, analyze, and connect them to identify the correct technical concept. Test your visual thinking, speed, and core engineering knowledge in this exciting challenge!',
            coordinators: [
                { name: "Kavin Aravind G", contact: "63828 63773" },
                { name: "T Rajamathi", contact: "87780 03748" }
            ],
            rules: [
                'Teams must have 2–3 members.',
                'No changes after the event starts.',
                'Questions are based on EEE concepts using images, symbols, or emojis.',
                'Answers must be identified within the given time.',
                'Mobile phones and external help are strictly prohibited.',
                'Only one team member may answer.',
                'Judges’ decisions are final.',
                'Malpractice leads to disqualification.'
            ],
            price: 50,
            isTeamEvent: true,
            minTeamSize: 2,
            maxTeamSize: 3
        },
        {
            id: 9,
            title: 'Blackout Files',
            image: blackout,
            desc: 'Decode the hidden data.',
            details: 'A mystery solving event where technical clues lead to the solution. Analyze the data and find the truth in the blackout.',
            coordinators: [
                { name: "Roseni M", contact: "73051 08002" },
                { name: "Shivani Sri S", contact: "91502 04514" }
            ],
            rules: [
                'Team of 2-4 members.',
                'Critical thinking required.',
                'Judges decision is final.'
            ],
            price: 50,
            isTeamEvent: true,
            minTeamSize: 2,
            maxTeamSize: 4
        }
    ],
    online: [
        {
            id: 101,
            title: 'Photography',
            image: photo,
            desc: 'Capture the moment.',
            details: 'Showcase your perspective through the lens. Theme-based photography contest where creativity meets composition.',
            coordinators: [{ name: "Priyadharshini S", contact: "96770 74387" }
            ],
            rules: [
                'Individual participation.',
                'Original photos only.',
                'No heavy editing allowed.',
                'Submit before deadline.'
            ],
            price: 30,
            isTeamEvent: false,
            minTeamSize: 1,
            maxTeamSize: 1
        },
        {
            id: 102,
            title: 'Poster Designing',
            image: posterDesign,
            desc: 'Design with impact.',
            details: 'Create compelling visual posters. Combine art and information to convey a powerful message.',
            coordinators: [{ name: "Rasikka S", contact: "88385 59060" }
            ],
            rules: [
                'Individual participation.',
                'Original designs only.',
                'Submit in high resolution.',
                'Judges decision is final.'
            ],
            price: 30,
            isTeamEvent: false,
            minTeamSize: 1,
            maxTeamSize: 1
        },
        {
            id: 103,
            title: 'AI Video Creation',
            image: aiVideo,
            desc: 'Generate the future.',
            details: 'Create amazing videos using AI tools. Push the boundaries of creativity with artificial intelligence.',
            coordinators: [{ name: "Kasthuri S", contact: "91508 69769" }],
            rules: [
                'Individual participation.',
                'AI tools allowed.',
                'Max duration: 2 minutes.',
                'Judges decision is final.'
            ],
            price: 30,
            isTeamEvent: false,
            minTeamSize: 1,
            maxTeamSize: 1
        }
    ]
};

export const workshopsData = [
    {
        id: 1,
        title: 'Kuka Robotics',
        image: kuka,
        desc: 'Hands-on experience with industrial robot arms.',
        details: 'Master the fundamentals of industrial robotics with KUKA. Learn to program and operate robotic arms used in modern manufacturing.',
        coordinators: [
            { name: 'S Koushikraj', contact: '93848 02557' },
            { name: 'Rajasubasri M', contact: '75982 27313' }
        ],
        rules: [
            'Laptop is mandatory.',
            'Software installation guide provided.',
            'Certificates provided upon completion.'
        ],
        price: 150
    },
    {
        id: 2,
        title: 'E-Vehicle',
        image: ev,
        desc: 'Dive into the future of automotive technology.',
        details: 'Explore the technology behind Electric Vehicles (EVs). Understand battery management systems, motor control, and EV architecture.',
        coordinators: [
            { name: 'Anto Jeba Infant M', contact: '63805 37819' },
            { name: 'Yeswanth K', contact: '72006 48235' }
        ],
        rules: [
            'Basic electronics knowledge required.',
            'Hands-on session included.',
            'Certificates provided upon completion.'
        ],
        price: 150
    },
    {
        id: 3,
        title: 'Renewable Energy',
        image: renewable,
        desc: 'Harness the power of nature for a sustainable future.',
        details: 'Learn about sustainable energy solutions including solar, wind, and hybrid systems. Practical insights into renewable energy grid integration.',
        coordinators: [
            { name: 'Nivash K', contact: '63814 43587' },
            { name: 'K Lokeshwaran', contact: '63694 86396' }
        ],
        rules: [
            'Open to all departments.',
            'Interactive session with experts.',
            'Certificates provided upon completion.'
        ],
        price: 150
    },
    {
        id: 4,
        title: 'Code to Cloud: ESP Workshop',
        image: iot,
        desc: 'From hardware to the cloud - a complete IoT journey.',
        details: ' Hosted by Club Assymetrics. A comprehensive workshop on IoT using ESP modules. Learn to program microcontrollers and connect them to cloud platforms for real-time data monitoring.',
        club: 'Club Assymetrics',
        coordinators: [
            { name: 'Jaison Binu Frank J', contact: '63812 89610' },
            { name: 'Madhubala D', contact: '70108 40912' }
        ],
        rules: [
            'Laptop required with USB port.',
            'ESP32/8266 kits provided for session.',
            'Certificates provided upon completion.'
        ],
        price: 150
    },
    {
        id: 5,
        title: 'Astronomy in Action',
        image: astronomy,
        desc: 'Explore the boundless universe.',
        details: 'Hosted by Club Callisto. Dive into the world of astronomy. Learn about celestial mechanics, telescopes, and the mysteries of the deep space.',
        club: 'Club Callisto',
        coordinators: [
            { name: 'Muthu Malesh M', contact: '90928 43831' },
            { name: 'Yazhini', contact: '95660 24632' }
        ],
        rules: [
            'Interest in space science required.',
            'Interactive session.',
            'Laptop are Mandatory.',
            'Certificates provided upon completion.'
        ],
        price: 150
    },
    {
        id: 6,
        title: 'Building a MicroSaaS',
        image: startup,
        desc: 'Turn your idea into a profitable product.',
        details: 'Learn the roadmap to building a MicroSaaS. From ideation and validation to MVP development and scaling. A must-attend for aspiring entrepreneurs.',
        coordinators: [{ name: "Musha Ahamed R Y", contact: "90922 55074" }],
        rules: [
            'Laptop required.',
            'No prior business knowledge needed.',
            'Certificates provided upon completion.'
        ],
        price: 150
    },
    {
        id: 7,
        title: 'Video Editing Workshop',
        image: videoEdit,
        desc: 'Edit and create stunning video content.',
        details: 'Master professional video editing software. Learn cutting, color grading, and effects to create cinematic content like a pro.',
        coordinators: [],
        rules: [
            'Laptop with Adobe Premiere/Davinci Resolve suggested.',
            'Basic editing knowledge is a plus.',
            'Certificates provided upon completion.'
        ],
        price: 150
    }
];
