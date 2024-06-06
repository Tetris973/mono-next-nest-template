import { library, config } from '@fortawesome/fontawesome-svg-core';
import { faHome, faSignOutAlt, faSignInAlt, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';

config.autoAddCss = false; // Prevent FontAwesome from adding its CSS automatically

// this is done to preload the icons so that they appear at first print
library.add(faHome, faSignOutAlt, faSignInAlt, faEye, faEyeSlash);
