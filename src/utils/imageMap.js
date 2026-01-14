// Image mapping for Events and Workshops
// Maps image keys to actual imports for use after fetching from Firestore

import paperPres from '../assets/images/paper presentation.png';
import projectPres from '../assets/images/imageposter.png';
import circuitDebug from '../assets/images/imagecircuit.png';
import wiring from '../assets/images/imagewiring.png';
import connections from '../assets/images/imageconnection.png';
import techQuiz from '../assets/images/imagequiz.png';
import ecad from '../assets/images/cad.avif';
import photo from '../assets/images/imagephotpo.png';
import posterDesign from '../assets/images/imageposter.png';
import aiVideo from '../assets/images/imagevideo.png';
import lastLogin from '../assets/images/imageentre.png';
import electrolink from '../assets/images/imageiot.png';
import blackout from '../assets/images/blackout_files.jpg';
import iot from '../assets/images/imageiot.png';
import ev from '../assets/images/imageev.png';
import renewable from '../assets/images/imagerenewable.png';
import kuka from '../assets/images/imagekuka.png';
import entrepreneurship from '../assets/images/imageentre.png';
import astronomy from '../assets/images/imageentre.png';
import videoEdit from '../assets/images/imagevideo.png';
import startup from '../assets/images/imagestartuppitch.png';

// Map event/workshop titles to images
export const imageMap = {
    // Technical Events
    'Circuit Debugging': circuitDebug,
    'Wiring Challenge': wiring,
    'Technical Quiz': techQuiz,
    'Paper Presentation': paperPres,
    'Project Presentation': projectPres,
    'E-Cadathon': ecad,
    'Last Login': lastLogin,
    'Electrolink': electrolink,
    'Blackout Files': blackout,

    // Online Events
    'Photography': photo,
    'Poster Designing': posterDesign,
    'AI Video Creation': aiVideo,

    // Workshops
    'Kuka Robotics': kuka,
    'E-Vehicle': ev,
    'Renewable Energy': renewable,
    'Code to Cloud: ESP Workshop': iot,
    'Astronomy in Action': astronomy,
    'Building a MicroSaaS': startup,
    'Video Editing Workshop': videoEdit,
};

// Default fallback image
export const defaultImage = circuitDebug;

/**
 * Get image for an event/workshop by title
 * @param {string} title - Event or workshop title
 * @returns {string} - Image import
 */
export const getImageByTitle = (title) => {
    return imageMap[title] || defaultImage;
};

export default imageMap;
