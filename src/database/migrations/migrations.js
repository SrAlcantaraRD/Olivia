// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import journal from './meta/_journal.json';
import m0000 from './0000_worried_calypso.sql';
import m0001 from './0001_seed-cic-module.sql';
import m0002 from './0002_seed-cic-module-fields.sql';
import m0003 from './0003_rapid_may_parker.sql';
import m0004 from './0004_uneven_prowler.sql';
import m0005 from './0005_lush_sandman.sql';
import m0006 from './0006_luxuriant_warbird.sql';

export default {
  journal,
  migrations: {
    m0000,
    m0001,
    m0002,
    m0003,
    m0004,
    m0005,
    m0006,
  },
};
