import { useState } from 'react';

// Define TypeScript interfaces for our data structures
export interface Rule {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
}

export interface RuleSet {
  id: string;
  name: string;
  description: string;
  type: string;
  rules: Rule[];
}

export interface RuleSetType {
  value: string;
  label: string;
}

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'info' | 'warning' | 'error';
}

export interface RuleFormData {
  title: string;
  description: string;
  severity: string;
}

export interface RuleSetFormData {
  name: string;
  description: string;
  type: string;
}

// Rule set types for categorization
export const ruleSetTypes: RuleSetType[] = [
  { value: 'alerting', label: 'Alerting' },
  { value: 'routing', label: 'Routing' },
  { value: 'security', label: 'Security' },
  { value: 'compliance', label: 'Compliance' },
  { value: 'development', label: 'Development' }
];

// Generate a unique ID for new items
const generateId = (): string => Math.random().toString(36).substr(2, 9);

export const useRuleSets = () => {
  // Initialize with sample rule sets data
  const [ruleSets, setRuleSets] = useState<RuleSet[]>([
    {
      id: 'rs-security-1',
      name: 'Security Rules',
      description: 'Rules for ensuring security protocols are followed',
      type: 'security',
      rules: [
        {
          id: 'rule-1',
          title: 'Password Requirements',
          description: 'Passwords must be at least 12 characters long and include uppercase, lowercase, numbers, and special characters.',
          severity: 'high'
        },
        {
          id: 'rule-3',
          title: 'Access Control',
          description: 'Access to production systems requires multi-factor authentication and proper authorization.',
          severity: 'high'
        },
        {
          id: 'rule-5',
          title: 'Incident Reporting',
          description: 'Security incidents must be reported within 24 hours of discovery.',
          severity: 'medium'
        }
      ]
    },
    {
      id: 'rs-compliance-1',
      name: 'Compliance Rules',
      description: 'Rules for regulatory compliance',
      type: 'compliance',
      rules: [
        {
          id: 'rule-2',
          title: 'Data Retention',
          description: 'Customer data must be retained for a minimum of 7 years and a maximum of 10 years.',
          severity: 'medium'
        }
      ]
    },
    {
      id: 'rs-dev-1',
      name: 'Development Guidelines',
      description: 'Rules for development processes',
      type: 'development',
      rules: [
        {
          id: 'rule-4',
          title: 'Code Review',
          description: 'All code changes must be reviewed by at least two team members before deployment.',
          severity: 'medium'
        }
      ]
    },
    {
      id: 'rs-alerting-1',
      name: 'System Alerts',
      description: 'Rules for system monitoring and alerting',
      type: 'alerting',
      rules: [
        {
          id: 'rule-6',
          title: 'Uptime Monitoring',
          description: 'System uptime should be monitored with alerts for downtimes exceeding 5 minutes.',
          severity: 'high'
        }
      ]
    },
    {
      id: 'rs-routing-1',
      name: 'Network Routing',
      description: 'Rules for network traffic routing',
      type: 'routing',
      rules: [
        {
          id: 'rule-7',
          title: 'Traffic Routing',
          description: 'All external traffic must be routed through the appropriate security gateways.',
          severity: 'medium'
        }
      ]
    }
  ]);

  // Notification state for user feedback
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    open: false,
    message: '',
    severity: 'success'
  });

  // Create a new rule set
  const createRuleSet = (ruleSetData: RuleSetFormData): void => {
    const newRuleSet: RuleSet = {
      ...ruleSetData,
      id: `rs-${ruleSetData.type}-${generateId()}`,
      rules: []
    };
    setRuleSets(prev => [...prev, newRuleSet]);
    setSnackbar({
      open: true,
      message: `Rule set "${ruleSetData.name}" created successfully!`,
      severity: 'success'
    });
  };

  // Update an existing rule set
  const updateRuleSet = (id: string, ruleSetData: RuleSetFormData): void => {
    setRuleSets(prev => prev.map(rs => 
      rs.id === id ? { ...rs, ...ruleSetData } : rs
    ));
    setSnackbar({
      open: true,
      message: `Rule set "${ruleSetData.name}" updated successfully!`,
      severity: 'success'
    });
  };

  // Delete a rule set
  const deleteRuleSet = (id: string): void => {
    const ruleSetToDelete = ruleSets.find(rs => rs.id === id);
    if (!ruleSetToDelete) return;
    
    setRuleSets(prev => prev.filter(rs => rs.id !== id));
    setSnackbar({
      open: true,
      message: `Rule set "${ruleSetToDelete.name}" deleted successfully!`,
      severity: 'success'
    });
  };

  // Create a new rule within a rule set
  const createRule = (ruleSetId: string, ruleData: RuleFormData): void => {
    const newRule: Rule = {
      ...ruleData,
      id: `rule-${generateId()}`,
      severity: ruleData.severity as 'high' | 'medium' | 'low'
    };
    setRuleSets(prev => prev.map(rs => 
      rs.id === ruleSetId 
        ? { ...rs, rules: [...rs.rules, newRule] }
        : rs
    ));
    setSnackbar({
      open: true,
      message: `Rule "${ruleData.title}" created successfully!`,
      severity: 'success'
    });
  };

  // Update an existing rule
  const updateRule = (ruleSetId: string, ruleId: string, ruleData: RuleFormData): void => {
    setRuleSets(prev => prev.map(rs => 
      rs.id === ruleSetId
        ? { 
            ...rs, 
            rules: rs.rules.map(rule => 
              rule.id === ruleId ? { 
                ...rule, 
                ...ruleData,
                severity: ruleData.severity as 'high' | 'medium' | 'low'
              } : rule
            )
          }
        : rs
    ));
    setSnackbar({
      open: true,
      message: `Rule "${ruleData.title}" updated successfully!`,
      severity: 'success'
    });
  };

  // Delete a rule
  const deleteRule = (ruleSetId: string, ruleId: string): void => {
    setRuleSets(prev => prev.map(rs => {
      if (rs.id === ruleSetId) {
        return {
          ...rs,
          rules: rs.rules.filter(rule => rule.id !== ruleId)
        };
      }
      return rs;
    }));
    setSnackbar({
      open: true,
      message: 'Rule deleted successfully!',
      severity: 'success'
    });
  };

  // Helper function to get appropriate icon name based on rule set type
  const getRuleSetIconName = (type: string): string => {
    switch (type) {
      case 'security':
        return 'security';
      case 'compliance':
        return 'gavel';
      case 'development':
        return 'code';
      case 'alerting':
        return 'notifications';
      case 'routing':
        return 'route';
      default:
        return 'settings';
    }
  };

  // Close the notification
  const closeSnackbar = (): void => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return {
    ruleSets,
    snackbar,
    createRuleSet,
    updateRuleSet,
    deleteRuleSet,
    createRule,
    updateRule,
    deleteRule,
    getRuleSetIconName,
    closeSnackbar
  };
};

export default useRuleSets;
