import { useState } from 'react';

const NETWORKING_SERVICES = ['Data Transfer', 'Virtual Private Cloud (VPC)', 'Load Balancing', 'Dedicated Connection', 'Public IPv4'];
const NETWORKING_CONNECTION_TYPES = ['Multipoint', 'Point-to-Point'];
const NETWORKING_ROUTING_TYPES = ['Dynamic', 'Fixed'];
const NETWORKING_HA_SUPPORT = ['Yes', 'No'];
const NETWORKING_VPC_SUPPORT = ['Yes', 'No'];
const NETWORKING_DIRECTIONS = ['Egress', 'Ingress', 'Intra-Cloud'];

/**
 * Networking-specific filter state
 */
export function useNetworkingFilters() {
  const [selectedNetworkingServices, setSelectedNetworkingServices] = useState<string[]>([...NETWORKING_SERVICES]);
  const [selectedNetworkingConnectionTypes, setSelectedNetworkingConnectionTypes] = useState<string[]>([...NETWORKING_CONNECTION_TYPES]);
  const [selectedNetworkingRoutingTypes, setSelectedNetworkingRoutingTypes] = useState<string[]>([...NETWORKING_ROUTING_TYPES]);
  const [selectedNetworkingHaSupport, setSelectedNetworkingHaSupport] = useState<string[]>([...NETWORKING_HA_SUPPORT]);
  const [selectedNetworkingVpcSupport, setSelectedNetworkingVpcSupport] = useState<string[]>([...NETWORKING_VPC_SUPPORT]);
  const [selectedNetworkingDirections, setSelectedNetworkingDirections] = useState<string[]>([...NETWORKING_DIRECTIONS]);

  return {
    selectedNetworkingServices,
    setSelectedNetworkingServices,
    selectedNetworkingConnectionTypes,
    setSelectedNetworkingConnectionTypes,
    selectedNetworkingRoutingTypes,
    setSelectedNetworkingRoutingTypes,
    selectedNetworkingHaSupport,
    setSelectedNetworkingHaSupport,
    selectedNetworkingVpcSupport,
    setSelectedNetworkingVpcSupport,
    selectedNetworkingDirections,
    setSelectedNetworkingDirections,
  };
}
