/**
 * Browser-based Seed Script for Firestore
 * 
 * HOW TO USE:
 * 1. Go to your deployed website or localhost
 * 2. Open browser console (F12 or Cmd+Option+I)
 * 3. Copy and paste this entire script
 * 4. Press Enter
 * 
 * This will seed your Firestore database with events and workshops.
 */

(async function seedFirestore() {
    const { initializeApp, getApps } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
    const { getFirestore, collection, addDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');

    // Your Firebase config - paste your actual config here if different
    const firebaseConfig = {
        apiKey: "AIzaSyC_rMPP2hy_VQAQk-6s_cI2Wo02l-Ia_bo",
        authDomain: "impulse2k26-58257.firebaseapp.com",
        projectId: "impulse2k26-58257",
        storageBucket: "impulse2k26-58257.firebasestorage.app",
        messagingSenderId: "95655055570",
        appId: "1:95655055570:web:4df9ad2eb3ca28ba8296c3"
    };

    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
    const db = getFirestore(app);

    // Events Data
    const technicalEvents = [
        {
            title: 'Circuit Debugging',
            category: 'Technical',
            desc: 'Find the faults and fix the circuits.',
            details: 'Test your electronics skills by identifying and fixing faults in complex circuits within a time limit. A challenge for the sharpest minds in circuitry.',
            coordinators: [
                { name: 'Madan Prakash K S', contact: '98402 15374' },
                { name: 'Pragadhiswari P', contact: '94448 58213' },
            ],
            rules: [
                'Individual participation or team of 2.',
                'Debugging tools will be provided.',
                'Time limit: 45 minutes.',
                'Judges decision is final.'
            ],
            price: 5
        },
        {
            title: 'Wiring Challenge',
            category: 'Technical',
            desc: 'Master the art of electrical connections.',
            details: 'A competition to test your speed and accuracy in electrical wiring and circuit connections. Precision and safety are key.',
            coordinators: [
                { name: 'Divainy J', contact: '80725 13973' },
                { name: 'Dharshini R', contact: '63833 45731' }
            ],
            rules: [
                'Team of 2 members.',
                'Safety gear (gloves) must be worn.',
                'Circuit diagram will be provided.',
                'Judges decision is final.'
            ],
            price: 5
        },
        {
            title: 'Technical Quiz',
            category: 'Technical',
            desc: 'Test your technical knowledge.',
            details: 'Battle of brains! Answer technical questions and prove your expertise in various engineering domains. From basics to advanced concepts.',
            coordinators: [
                { name: "R kishore", contact: "63699 02036" },
                { name: 'Vimal Deep A L', contact: '96297 91556' }
            ],
            rules: [
                'Team of 2 members.',
                'No electronic gadgets allowed.',
                'Quiz specific rules will be announced on spot.',
                'Judges decision is final.'
            ],
            price: 5
        },
        {
            title: 'Paper Presentation',
            category: 'Technical',
            desc: 'Showcase your innovative ideas and research.',
            details: 'Present your technical papers on cutting-edge technologies. A platform to share knowledge, innovations, and research findings with a panel of experts.',
            coordinators: [
                { name: 'J Jerauld Alwin', contact: '94983 50881' },
                { name: 'Jaya Sudha', contact: '63827 55248' },
            ],
            rules: [
                'Maximum 3 members per team.',
                'Abstract must be submitted before the deadline.',
                'Presentation time: 7 mins + 3 mins Q&A.',
                'Judges decision is final.'
            ],
            price: 5
        },
        {
            title: 'Project Presentation',
            category: 'Technical',
            desc: 'Visualise your technical concepts creatively.',
            details: 'Demonstrate your engineering projects and prototypes. Impress the judges with your practical implementation and innovative solutions.',
            coordinators: [
                { name: 'Jithish J', contact: '93455 99313' },
                { name: 'Mohana P', contact: '98436 29288' },
                { name: 'Suhasini', contact: '63796 38550' }
            ],
            rules: [
                'Maximum 3 members per team.',
                'Working prototype is mandatory.',
                'Presentation time: 7 mins + 3 mins Q&A.',
                'Judges decision is final.'
            ],
            price: 5
        },
        {
            title: 'E-Cadathon',
            category: 'Technical',
            desc: 'Design complex electrical systems.',
            details: 'Showcase your CAD skills by designing electrical layouts and systems efficiently using industry-standard software.',
            coordinators: [
                { name: 'B Bragadeeshwaran', contact: '90428 51602' },
                { name: "V Mathivanan", contact: "93636 14486" }
            ],
            rules: [
                'Individual participation.',
                'Software provided: AutoCAD/Eagle.',
                'Time limit: 1 hour.',
                'Judges decision is final.'
            ],
            price: 5
        },
        {
            title: 'Last Login',
            category: 'Technical',
            desc: 'Unlock the digital mysteries.',
            details: 'Hosted by Club Celestial. A challenge of logic, coding, and problem-solving. Can you crack the code before time runs out?',
            club: 'Club Celestial',
            coordinators: [
                { name: "Rudra Prasad M L", contact: "80720 29917" },
                { name: "Adhisaya", contact: "90428 70525" }
            ],
            rules: [
                'Team of 2 members.',
                'Laptop required.',
                'Judges decision is final.'
            ],
            price: 5
        },
        {
            title: 'Electrolink',
            category: 'Technical',
            desc: 'Forge the connections.',
            details: 'A circuit design and linking challenge. Understand the flow, connect the components, and make the system live.',
            coordinators: [
                { name: "G Kavin Aravind", contact: "63828 63773" },
                { name: "T Rajamathi", contact: "87780 03748" }
            ],
            rules: [
                'Team of 2 members.',
                'Components provided.',
                'Judges decision is final.'
            ],
            price: 5
        },
        {
            title: 'Blackout Files',
            category: 'Technical',
            desc: 'Decode the hidden data.',
            details: 'A mystery solving event where technical clues lead to the solution. Analyze the data and find the truth in the blackout.',
            coordinators: [
                { name: "Roseni M", contact: " 73051 08002" },
                { name: "Shivani Sri S", contact: "91502 04514" }
            ],
            rules: [
                'Team of 2-3 members.',
                'Critical thinking required.',
                'Judges decision is final.'
            ],
            price: 5
        }
    ];

    const onlineEvents = [
        {
            title: 'Photography',
            category: 'Online',
            desc: 'Capture the moment.',
            details: 'Showcase your perspective through the lens. Theme-based photography contest where creativity meets composition.',
            coordinators: [{ name: "Priyadharshini S", contact: "96770 74387" }],
            rules: [
                'Individual participation.',
                'Original photos only.',
                'No heavy editing allowed.',
                'Submit before deadline.'
            ],
            price: 5
        },
        {
            title: 'Poster Designing',
            category: 'Online',
            desc: 'Design with impact.',
            details: 'Create compelling visual posters. Combine art and information to convey a powerful message.',
            coordinators: [{ name: "Rasikka S", contact: "88385 59060" }],
            rules: [
                'Individual participation.',
                'Original designs only.',
                'Submit in high resolution.',
                'Judges decision is final.'
            ],
            price: 5
        },
        {
            title: 'AI Video Creation',
            category: 'Online',
            desc: 'Generate the future.',
            details: 'Create amazing videos using AI tools. Push the boundaries of creativity with artificial intelligence.',
            coordinators: [{ name: "Kasthuri S", contact: "91508 69769" }],
            rules: [
                'Individual participation.',
                'AI tools allowed.',
                'Max duration: 2 minutes.',
                'Judges decision is final.'
            ],
            price: 5
        }
    ];

    const workshopsData = [
        {
            title: 'Kuka Robotics',
            category: 'Workshop',
            desc: 'Hands-on experience with industrial robot arms.',
            details: 'Master the fundamentals of industrial robotics with KUKA. Learn to program and operate robotic arms used in modern manufacturing.',
            coordinators: [
                { name: 'Koushik Raj', contact: '' },
                { name: 'Rajasubasri', contact: '' },
                { name: 'Govardhan', contact: '' }
            ],
            rules: [
                'Laptop is mandatory.',
                'Software installation guide provided.',
                'Certificates provided upon completion.'
            ],
            price: 50
        },
        {
            title: 'E-Vehicle',
            category: 'Workshop',
            desc: 'Dive into the future of automotive technology.',
            details: 'Explore the technology behind Electric Vehicles (EVs). Understand battery management systems, motor control, and EV architecture.',
            coordinators: [
                { name: 'Anto Jeba Infant', contact: '6380537819' },
                { name: 'Sanjeeve', contact: '' },
                { name: 'Yeswanth K', contact: '' }
            ],
            rules: [
                'Basic electronics knowledge required.',
                'Hands-on session included.',
                'Certificates provided upon completion.'
            ],
            price: 50
        },
        {
            title: 'Renewable Energy',
            category: 'Workshop',
            desc: 'Harness the power of nature for a sustainable future.',
            details: 'Learn about sustainable energy solutions including solar, wind, and hybrid systems. Practical insights into renewable energy grid integration.',
            coordinators: [
                { name: 'Lokeshwaran', contact: '' },
                { name: 'Nivash', contact: '' },
                { name: 'Gopika', contact: '' }
            ],
            rules: [
                'Open to all departments.',
                'Interactive session with experts.',
                'Certificates provided upon completion.'
            ],
            price: 50
        },
        {
            title: 'Code to Cloud: ESP Workshop',
            category: 'Workshop',
            desc: 'From hardware to the cloud - a complete IoT journey.',
            details: 'Hosted by Club Assymetrics. A comprehensive workshop on IoT using ESP modules. Learn to program microcontrollers and connect them to cloud platforms for real-time data monitoring.',
            club: 'Club Assymetrics',
            coordinators: [
                { name: 'Jaison Binu Frank', contact: '' },
                { name: 'Shivani Sri', contact: '' },
                { name: 'Madhubala', contact: '' }
            ],
            rules: [
                'Laptop required with USB port.',
                'ESP32/8266 kits provided for session.',
                'Certificates provided upon completion.'
            ],
            price: 50
        },
        {
            title: 'Astronomy in Action',
            category: 'Workshop',
            desc: 'Explore the boundless universe.',
            details: 'Hosted by Club Callisto. Dive into the world of astronomy. Learn about celestial mechanics, telescopes, and the mysteries of the deep space.',
            club: 'Club Callisto',
            coordinators: [],
            rules: [
                'Interest in space science required.',
                'Interactive session.',
                'Certificates provided upon completion.'
            ],
            price: 50
        },
        {
            title: 'Building a MicroSaaS',
            category: 'Workshop',
            desc: 'Turn your idea into a profitable product.',
            details: 'Learn the roadmap to building a MicroSaaS. From ideation and validation to MVP development and scaling. A must-attend for aspiring entrepreneurs.',
            coordinators: [{ name: "Musha Ahamed", contact: "9092255074" }],
            rules: [
                'Laptop required.',
                'No prior business knowledge needed.',
                'Certificates provided upon completion.'
            ],
            price: 50
        },
        {
            title: 'Video Editing Workshop',
            category: 'Workshop',
            desc: 'Edit and create stunning video content.',
            details: 'Master professional video editing software. Learn cutting, color grading, and effects to create cinematic content like a pro.',
            coordinators: [],
            rules: [
                'Laptop with Adobe Premiere/Davinci Resolve suggested.',
                'Basic editing knowledge is a plus.',
                'Certificates provided upon completion.'
            ],
            price: 50
        }
    ];

    console.log('🌱 Starting Firestore seed...\n');

    let count = 0;

    // Seed Technical Events
    console.log('📌 Seeding Technical Events...');
    for (const event of technicalEvents) {
        await addDoc(collection(db, 'events'), {
            ...event,
            createdAt: serverTimestamp()
        });
        count++;
        console.log(`   ✓ ${event.title}`);
    }

    // Seed Online Events
    console.log('\n📌 Seeding Online Events...');
    for (const event of onlineEvents) {
        await addDoc(collection(db, 'events'), {
            ...event,
            createdAt: serverTimestamp()
        });
        count++;
        console.log(`   ✓ ${event.title}`);
    }

    // Seed Workshops
    console.log('\n📌 Seeding Workshops...');
    for (const workshop of workshopsData) {
        await addDoc(collection(db, 'workshops'), {
            ...workshop,
            createdAt: serverTimestamp()
        });
        count++;
        console.log(`   ✓ ${workshop.title}`);
    }

    console.log(`\n✅ Successfully seeded ${count} documents to Firestore!`);
    console.log('\n🎉 Seeding complete! Refresh the events page to see the data.');
})();
