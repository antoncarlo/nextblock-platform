import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { 
  Shield, 
  FileCheck, 
  Users, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Building2,
  Globe,
  Eye,
  Lock,
  FileText,
  Upload,
  Download,
  Search,
  Filter
} from 'lucide-react'

const ComplianceFramework = () => {
  const { t } = useTranslation()
  const [activeTab, setActiveTab] = useState('kyc')
  const [complianceData, setComplianceData] = useState({
    kycApplications: [],
    amlAlerts: [],
    complianceMetrics: {},
    auditTrail: []
  })
  const [isLoading, setIsLoading] = useState(true)

  // Simulate compliance data loading
  useEffect(() => {
    const fetchComplianceData = async () => {
      setIsLoading(true)
      
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const mockData = {
        kycApplications: [
          {
            id: 'kyc-001',
            applicantName: 'Deutsche Insurance AG',
            applicantType: 'institutional',
            status: 'approved',
            submissionDate: '2025-09-15T10:00:00Z',
            reviewDate: '2025-09-17T14:30:00Z',
            riskLevel: 'low',
            investmentAmount: 5000000,
            documents: ['certificate_of_incorporation', 'financial_statements', 'beneficial_ownership']
          },
          {
            id: 'kyc-002',
            applicantName: 'Swiss Re Capital Partners',
            applicantType: 'institutional',
            status: 'pending_review',
            submissionDate: '2025-09-18T09:15:00Z',
            reviewDate: null,
            riskLevel: 'medium',
            investmentAmount: 12000000,
            documents: ['certificate_of_incorporation', 'financial_statements', 'compliance_certificate']
          },
          {
            id: 'kyc-003',
            applicantName: 'Allianz Investment Management',
            applicantType: 'institutional',
            status: 'requires_additional_info',
            submissionDate: '2025-09-16T16:45:00Z',
            reviewDate: '2025-09-18T11:20:00Z',
            riskLevel: 'low',
            investmentAmount: 8500000,
            documents: ['certificate_of_incorporation', 'financial_statements']
          }
        ],
        amlAlerts: [
          {
            id: 'aml-001',
            type: 'large_transaction',
            severity: 'medium',
            description: 'Transaction exceeds €1M threshold',
            entityName: 'Deutsche Insurance AG',
            amount: 2500000,
            timestamp: '2025-09-19T08:30:00Z',
            status: 'reviewed',
            reviewer: 'Compliance Officer'
          },
          {
            id: 'aml-002',
            type: 'suspicious_pattern',
            severity: 'high',
            description: 'Multiple rapid transactions from same entity',
            entityName: 'Unknown Entity',
            amount: 750000,
            timestamp: '2025-09-19T07:15:00Z',
            status: 'investigating',
            reviewer: 'Senior Analyst'
          }
        ],
        complianceMetrics: {
          totalApplications: 156,
          approvedApplications: 142,
          pendingApplications: 8,
          rejectedApplications: 6,
          averageProcessingTime: 2.3, // days
          complianceScore: 98.5,
          amlAlertsThisMonth: 12,
          resolvedAlertsThisMonth: 10
        },
        auditTrail: [
          {
            id: 'audit-001',
            action: 'KYC_APPROVED',
            entityId: 'kyc-001',
            userId: 'compliance_officer_1',
            timestamp: '2025-09-17T14:30:00Z',
            details: 'Application approved after document verification'
          },
          {
            id: 'audit-002',
            action: 'AML_ALERT_CREATED',
            entityId: 'aml-002',
            userId: 'system',
            timestamp: '2025-09-19T07:15:00Z',
            details: 'Automatic alert triggered by transaction monitoring'
          }
        ]
      }
      
      setComplianceData(mockData)
      setIsLoading(false)
    }

    fetchComplianceData()
  }, [])

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-green-900/20 text-green-400 border-green-500/30'
      case 'pending_review': return 'bg-yellow-900/20 text-yellow-400 border-yellow-500/30'
      case 'requires_additional_info': return 'bg-orange-900/20 text-orange-400 border-orange-500/30'
      case 'rejected': return 'bg-red-900/20 text-red-400 border-red-500/30'
      case 'investigating': return 'bg-purple-900/20 text-purple-400 border-purple-500/30'
      case 'reviewed': return 'bg-blue-900/20 text-blue-400 border-blue-500/30'
      default: return 'bg-slate-900/20 text-slate-400 border-slate-500/30'
    }
  }

  const getRiskLevelColor = (level) => {
    switch (level) {
      case 'low': return 'text-green-400'
      case 'medium': return 'text-yellow-400'
      case 'high': return 'text-red-400'
      default: return 'text-slate-400'
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'low': return 'text-green-400'
      case 'medium': return 'text-yellow-400'
      case 'high': return 'text-red-400'
      case 'critical': return 'text-red-500'
      default: return 'text-slate-400'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">{t('compliance.loading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {t('compliance.title')}
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              {t('compliance.subtitle')}
            </p>
          </div>

          {/* Compliance Metrics Overview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-8 grid md:grid-cols-4 gap-6"
          >
            {[
              {
                title: t('compliance.metrics.complianceScore'),
                value: `${complianceData.complianceMetrics.complianceScore}%`,
                icon: Shield,
                color: 'text-green-400',
                bgColor: 'bg-green-900/20'
              },
              {
                title: t('compliance.metrics.pendingApplications'),
                value: complianceData.complianceMetrics.pendingApplications,
                icon: Clock,
                color: 'text-yellow-400',
                bgColor: 'bg-yellow-900/20'
              },
              {
                title: t('compliance.metrics.averageProcessingTime'),
                value: `${complianceData.complianceMetrics.averageProcessingTime} days`,
                icon: FileCheck,
                color: 'text-blue-400',
                bgColor: 'bg-blue-900/20'
              },
              {
                title: t('compliance.metrics.amlAlerts'),
                value: complianceData.complianceMetrics.amlAlertsThisMonth,
                icon: AlertTriangle,
                color: 'text-red-400',
                bgColor: 'bg-red-900/20'
              }
            ].map((metric, index) => (
              <div
                key={index}
                className={`${metric.bgColor} backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50`}
              >
                <div className="flex items-center justify-between mb-4">
                  <metric.icon className={`w-8 h-8 ${metric.color}`} />
                  <div className={`text-2xl font-bold text-white`}>
                    {metric.value}
                  </div>
                </div>
                <div className="text-sm text-slate-300">
                  {metric.title}
                </div>
              </div>
            ))}
          </motion.div>

          {/* Navigation Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <div className="flex flex-wrap gap-2 bg-slate-800/50 backdrop-blur-sm rounded-2xl p-2 border border-slate-700/50">
              {[
                { id: 'kyc', label: t('compliance.tabs.kyc'), icon: Users },
                { id: 'aml', label: t('compliance.tabs.aml'), icon: Eye },
                { id: 'audit', label: t('compliance.tabs.audit'), icon: FileText },
                { id: 'reports', label: t('compliance.tabs.reports'), icon: Download }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-700/50'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* KYC Applications Tab */}
            {activeTab === 'kyc' && (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Users className="w-6 h-6" />
                    {t('compliance.kyc.title')}
                  </h2>
                  <div className="flex gap-2">
                    <button className="p-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
                      <Search className="w-5 h-5 text-slate-400" />
                    </button>
                    <button className="p-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
                      <Filter className="w-5 h-5 text-slate-400" />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {complianceData.kycApplications.map((application) => (
                    <div
                      key={application.id}
                      className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/50"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-1">
                            {application.applicantName}
                          </h3>
                          <div className="flex items-center gap-4 text-sm text-slate-400">
                            <span className="flex items-center gap-1">
                              <Building2 className="w-4 h-4" />
                              {application.applicantType}
                            </span>
                            <span>
                              Submitted: {new Date(application.submissionDate).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-lg border text-sm ${getStatusColor(application.status)}`}>
                          {application.status.replace('_', ' ').toUpperCase()}
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <div className="text-sm text-slate-400 mb-1">Investment Amount</div>
                          <div className="text-lg font-semibold text-white">
                            €{application.investmentAmount.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-400 mb-1">Risk Level</div>
                          <div className={`font-medium ${getRiskLevelColor(application.riskLevel)}`}>
                            {application.riskLevel.toUpperCase()}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-slate-400 mb-1">Documents</div>
                          <div className="text-white">
                            {application.documents.length} files
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {application.documents.map((doc, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-slate-600/50 text-xs text-slate-300 rounded"
                            >
                              {doc.replace('_', ' ')}
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                            Review
                          </button>
                          <button className="px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AML Monitoring Tab */}
            {activeTab === 'aml' && (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Eye className="w-6 h-6" />
                    {t('compliance.aml.title')}
                  </h2>
                  <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                    Create Alert
                  </button>
                </div>

                <div className="space-y-4">
                  {complianceData.amlAlerts.map((alert) => (
                    <div
                      key={alert.id}
                      className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/50"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <AlertTriangle className={`w-5 h-5 ${getSeverityColor(alert.severity)}`} />
                            <h3 className="text-lg font-semibold text-white">
                              {alert.type.replace('_', ' ').toUpperCase()}
                            </h3>
                            <span className={`px-2 py-1 rounded text-xs ${getSeverityColor(alert.severity)}`}>
                              {alert.severity.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-slate-300 mb-2">{alert.description}</p>
                          <div className="text-sm text-slate-400">
                            Entity: {alert.entityName} | Amount: €{alert.amount.toLocaleString()}
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-lg border text-sm ${getStatusColor(alert.status)}`}>
                          {alert.status.replace('_', ' ').toUpperCase()}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-400">
                          Reviewed by: {alert.reviewer} | {new Date(alert.timestamp).toLocaleString()}
                        </div>
                        <div className="flex gap-2">
                          <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                            Resolve
                          </button>
                          <button className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors">
                            Escalate
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Audit Trail Tab */}
            {activeTab === 'audit' && (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <FileText className="w-6 h-6" />
                    {t('compliance.audit.title')}
                  </h2>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                    Export Log
                  </button>
                </div>

                <div className="space-y-3">
                  {complianceData.auditTrail.map((entry) => (
                    <div
                      key={entry.id}
                      className="flex items-center gap-4 p-4 bg-slate-700/30 rounded-xl border border-slate-600/50"
                    >
                      <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-medium text-white">{entry.action}</span>
                          <span className="text-sm text-slate-400">by {entry.userId}</span>
                        </div>
                        <p className="text-sm text-slate-300">{entry.details}</p>
                      </div>
                      <div className="text-sm text-slate-400">
                        {new Date(entry.timestamp).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Reports Tab */}
            {activeTab === 'reports' && (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/50">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Download className="w-6 h-6" />
                    {t('compliance.reports.title')}
                  </h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {[
                    {
                      title: 'Monthly Compliance Report',
                      description: 'Comprehensive compliance metrics and KYC statistics',
                      type: 'PDF',
                      lastGenerated: '2025-09-01'
                    },
                    {
                      title: 'AML Transaction Report',
                      description: 'Detailed analysis of flagged transactions and resolutions',
                      type: 'Excel',
                      lastGenerated: '2025-09-15'
                    },
                    {
                      title: 'Regulatory Filing',
                      description: 'Quarterly regulatory submission for financial authorities',
                      type: 'XML',
                      lastGenerated: '2025-07-01'
                    },
                    {
                      title: 'Audit Trail Export',
                      description: 'Complete audit log for external auditor review',
                      type: 'CSV',
                      lastGenerated: '2025-09-18'
                    }
                  ].map((report, index) => (
                    <div
                      key={index}
                      className="bg-slate-700/30 rounded-xl p-6 border border-slate-600/50"
                    >
                      <h3 className="text-lg font-semibold text-white mb-2">
                        {report.title}
                      </h3>
                      <p className="text-slate-300 mb-4">{report.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-slate-400">
                          Last generated: {report.lastGenerated}
                        </div>
                        <div className="flex gap-2">
                          <span className="px-2 py-1 bg-slate-600/50 text-xs text-slate-300 rounded">
                            {report.type}
                          </span>
                          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                            Generate
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default ComplianceFramework
