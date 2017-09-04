import LocalizedStrings from 'react-localization';
import { Configurations } from '../../Utils/config.js';

import en from './English.js';

let strings = new LocalizedStrings({
   "EN": en // we can provide files with comma separated like ES.js
});

strings.setLanguage(Configurations.lang);
export default strings;
