import { processUnits } from './problem';
import { PUSH_BASED } from '../data';

// print the report
// and ignore the returned total duration
processUnits(PUSH_BASED, true);

// only the total duration is needed
const totalDuration = processUnits(PUSH_BASED);
console.log(`Total Task Duration: ${totalDuration} hours`);

