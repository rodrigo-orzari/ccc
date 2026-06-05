import { useState } from 'react';

const DB_FAMILIES = ['Relational', 'NoSQL'];
const DB_ENGINES = ['PostgreSQL', 'MySQL', 'MariaDB', 'SQL Server', 'Oracle DB', 'Cosmos DB', 'MongoDB', 'Redis', 'Valkey', 'DB2'];
const DEPLOYMENT_TYPES = ['Provisioned', 'Serverless'];
const HA_MODES = ['Single AZ', 'Multi AZ', 'Zone Redundant', 'Multi Region', 'Geo Redundant'];

/**
 * Database-specific filter state
 */
export function useDatabaseFilters() {
  const [selectedDbFamilies, setSelectedDbFamilies] = useState<string[]>([...DB_FAMILIES]);
  const [selectedEngines, setSelectedEngines] = useState<string[]>([...DB_ENGINES]);
  const [selectedDeploymentTypes, setSelectedDeploymentTypes] = useState<string[]>([...DEPLOYMENT_TYPES]);
  const [selectedHaModes, setSelectedHaModes] = useState<string[]>([...HA_MODES]);

  return {
    selectedDbFamilies,
    setSelectedDbFamilies,
    selectedEngines,
    setSelectedEngines,
    selectedDeploymentTypes,
    setSelectedDeploymentTypes,
    selectedHaModes,
    setSelectedHaModes,
  };
}
