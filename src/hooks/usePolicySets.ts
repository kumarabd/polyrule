import { useState } from 'react';

// Define types for the hook
export interface Policy {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'draft' | 'inactive';
}

export interface PolicySet {
  id: string;
  name: string;
  description: string;
  type: string;
  policies: Policy[];
}

export interface PolicySetType {
  value: string;
  label: string;
}

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'info' | 'warning' | 'error';
}

// Initial dummy data for policy sets
const initialPolicySets: PolicySet[] = [
  {
    id: '1',
    name: 'Authorization',
    description: 'Policy set for managing user authentication and access control.',
    type: 'authorization',
    policies: [
      {
        id: '101',
        name: 'Password Policy',
        description: 'Requires minimum 12 characters with mixed case, numbers and special characters.',
        status: 'active'
      },
      {
        id: '102',
        name: 'Account Lockout Policy',
        description: 'Locks account after 5 failed login attempts.',
        status: 'active'
      }
    ]
  },
  {
    id: '2',
    name: 'Firewall',
    description: 'Policy set for managing network security and traffic controls.',
    type: 'firewall',
    policies: [
      {
        id: '201',
        name: 'Inbound Traffic Policy',
        description: 'Restricts inbound traffic to specific ports and protocols.',
        status: 'active'
      }
    ]
  },
  {
    id: '3',
    name: 'Business Compliance',
    description: 'Policy set for managing business compliance and regulatory requirements.',
    type: 'business',
    policies: [
      {
        id: '301',
        name: 'Data Retention',
        description: 'Data must be retained for 7 years according to regulations.',
        status: 'active'
      },
      {
        id: '302',
        name: 'Vendor Management',
        description: 'All vendors must complete security assessments annually.',
        status: 'draft'
      }
    ]
  }
];

// Policy set type options with labels
export const policySetTypes: PolicySetType[] = [
  { value: 'authorization', label: 'Authorization' },
  { value: 'firewall', label: 'Firewall' },
  { value: 'business', label: 'Business' },
  { value: 'security', label: 'Security' },
  { value: 'compliance', label: 'Compliance' },
  { value: 'custom', label: 'Custom' }
];

export interface UsePolicySetsReturn {
  policySets: PolicySet[];
  snackbar: SnackbarState;
  createPolicySet: (policySetData: Omit<PolicySet, 'id' | 'policies'>) => PolicySet;
  updatePolicySet: (id: string, policySetData: Partial<Omit<PolicySet, 'id' | 'policies'>>) => PolicySet | undefined;
  deletePolicySet: (id: string) => void;
  createPolicy: (policySetId: string, policyData: Omit<Policy, 'id'>) => Policy;
  updatePolicy: (policySetId: string, policyId: string, policyData: Partial<Omit<Policy, 'id'>>) => Policy | undefined;
  deletePolicy: (policySetId: string, policyId: string) => void;
  getPolicySetIconName: (type: string) => string;
  closeSnackbar: () => void;
}

export const usePolicySets = (): UsePolicySetsReturn => {
  // State for policy sets
  const [policySets, setPolicySets] = useState<PolicySet[]>(initialPolicySets);
  
  // State for snackbar notifications
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Show notification
  const showNotification = (message: string, severity: SnackbarState['severity'] = 'success'): void => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  // Close snackbar
  const closeSnackbar = (): void => {
    setSnackbar({
      ...snackbar,
      open: false
    });
  };

  // Create new policy set
  const createPolicySet = (policySetData: Omit<PolicySet, 'id' | 'policies'>): PolicySet => {
    const newPolicySet: PolicySet = {
      id: Date.now().toString(),
      ...policySetData,
      policies: []
    };
    
    setPolicySets([...policySets, newPolicySet]);
    showNotification(`Policy Set '${policySetData.name}' created successfully`);
    return newPolicySet;
  };

  // Update existing policy set
  const updatePolicySet = (id: string, policySetData: Partial<Omit<PolicySet, 'id' | 'policies'>>): PolicySet | undefined => {
    const updatedPolicySets = policySets.map(policySet => 
      policySet.id === id ? { ...policySet, ...policySetData } : policySet
    );
    setPolicySets(updatedPolicySets);
    showNotification(`Policy Set updated successfully`);
    return updatedPolicySets.find(policySet => policySet.id === id);
  };

  // Delete policy set
  const deletePolicySet = (id: string): void => {
    setPolicySets(policySets.filter(policySet => policySet.id !== id));
    showNotification(`Policy Set deleted successfully`, 'info');
  };

  // Create policy within a policy set
  const createPolicy = (policySetId: string, policyData: Omit<Policy, 'id'>): Policy => {
    const newPolicy: Policy = {
      id: Date.now().toString(),
      ...policyData
    };
    
    const updatedPolicySets = policySets.map(policySet => 
      policySet.id === policySetId 
        ? { 
            ...policySet, 
            policies: [...policySet.policies, newPolicy] 
          } 
        : policySet
    );
    
    setPolicySets(updatedPolicySets);
    showNotification(`Policy '${policyData.name}' created successfully`);
    return newPolicy;
  };

  // Update policy in a policy set
  const updatePolicy = (policySetId: string, policyId: string, policyData: Partial<Omit<Policy, 'id'>>): Policy | undefined => {
    const updatedPolicySets = policySets.map(policySet => 
      policySet.id === policySetId 
        ? { 
            ...policySet, 
            policies: policySet.policies.map(policy => 
              policy.id === policyId 
                ? { ...policy, ...policyData } 
                : policy
            ) 
          } 
        : policySet
    );
    
    setPolicySets(updatedPolicySets);
    showNotification(`Policy updated successfully`);
    
    // Return the updated policy
    const updatedPolicySet = updatedPolicySets.find(ps => ps.id === policySetId);
    return updatedPolicySet?.policies.find(p => p.id === policyId);
  };

  // Delete policy from a policy set
  const deletePolicy = (policySetId: string, policyId: string): void => {
    setPolicySets(policySets.map(policySet => 
      policySet.id === policySetId 
        ? { 
            ...policySet, 
            policies: policySet.policies.filter(policy => policy.id !== policyId) 
          } 
        : policySet
    ));
    
    showNotification(`Policy deleted successfully`, 'info');
  };

  // Get icon name based on policy set type
  const getPolicySetIconName = (type: string): string => {
    switch (type) {
      case 'authorization':
        return 'VpnKey';
      case 'firewall':
        return 'Shield'; // Using Shield instead of Firewall
      case 'business':
        return 'Business';
      case 'compliance':
        return 'Gavel';
      case 'custom':
        return 'Settings';
      default:
        return 'Security';
    }
  };

  return {
    policySets,
    snackbar,
    createPolicySet,
    updatePolicySet,
    deletePolicySet,
    createPolicy,
    updatePolicy,
    deletePolicy,
    getPolicySetIconName,
    closeSnackbar
  };
};
