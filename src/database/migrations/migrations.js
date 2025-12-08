import journal from './meta/_journal.json';
import m0000 from './0000_third_proemial_gods.sql';
import m0001 from './0001_seed-cic-module.sql';
import m0002 from './0002_black_ben_grimm.sql';
import m0003 from './0003_seed-cic-module-fields.sql';

export default {
  journal,
  migrations: {
    m0000,
    m0001,
    m0002,
    m0003,
  },
};
