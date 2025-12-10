import m0000 from './0000_worried_calypso.sql';
import m0001 from './0001_seed-cic-module.sql';
import m0002 from './0002_seed-cic-module-fields.sql';
import journal from './meta/_journal.json';

export default {
  journal,
  migrations: {
    m0000,
    m0001,
    m0002,
  },
};
