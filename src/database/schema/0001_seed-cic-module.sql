INSERT INTO
  module (code, name, description, active)
VALUES
  (
    'CIC',
    'Cateterismos (CIC)',
    'Registro de cateterismos intermitentes limpios.',
    0,
  );

-- Insert CIC fields
INSERT INTO
  module_field (
    moduleID,
    title,
    description,
    type,
    values
,
      required,
      order
  )
VALUES
  (
    (
      SELECT
        id
      FROM
        module
      WHERE
        code = 'CIC'
    ),
    'volumeLevel',
    NULL,
    'enum',
    '["low","normal","high"]',
    1,
    1
  );

INSERT INTO
  module_field (
    moduleID,
    title,
    description,
    type,
    values
,
      required,
      ord
  )
VALUES
  (
    (
      SELECT
        id
      FROM
        module
      WHERE
        code = 'cic'
    ),
    'color',
    NULL,
    'enum',
    '["transparent","light_yellow","dark_yellow","abnormal"]',
    1,
    2
  );

INSERT INTO
  module_field (
    moduleID,
    title,
    description,
    type,
    values
,
      required,
      ord
  )
VALUES
  (
    (
      SELECT
        id
      FROM
        module
      WHERE
        code = 'cic'
    ),
    'turbidity',
    NULL,
    'enum',
    '["clear","mild","high"]',
    1,
    3
  );

INSERT INTO
  module_field (
    moduleID,
    title,
    description,
    type,
    values
,
      required,
      ord
  )
VALUES
  (
    (
      SELECT
        id
      FROM
        module
      WHERE
        code = 'cic'
    ),
    'discomfortLevel',
    NULL,
    'enum',
    '["none","mild","pain"]',
    1,
    4
  );

INSERT INTO
  module_field (
    moduleID,
    title,
    description,
    type,
    values
,
      required,
      ord
  )
VALUES
  (
    (
      SELECT
        id
      FROM
        module
      WHERE
        code = 'cic'
    ),
    'notes',
    NULL,
    'string',
    NULL,
    0,
    5
  );

INSERT INTO
  module_field (
    moduleID,
    title,
    description,
    type,
    values
,
      required,
      ord
  )
VALUES
  (
    (
      SELECT
        id
      FROM
        module
      WHERE
        code = 'cic'
    ),
    'source',
    NULL,
    'enum',
    '["primary","secondary"]',
    1,
    6
  );

INSERT INTO
  module_field (
    moduleID,
    title,
    description,
    type,
    values
,
      required,
      ord
  )
VALUES
  (
    (
      SELECT
        id
      FROM
        module
      WHERE
        code = 'cic'
    ),
    'deviceId',
    NULL,
    'string',
    NULL,
    0,
    7
  );

INSERT INTO
  module_field (
    moduleID,
    title,
    description,
    type,
    values
,
      required,
      ord
  )
VALUES
  (
    (
      SELECT
        id
      FROM
        module
      WHERE
        code = 'cic'
    ),
    'syncStatus',
    NULL,
    'enum',
    '["local_only","synced"]',
    1,
    8
  );
