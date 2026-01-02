import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import memberService from '../../services/memberService.firebase';
import './AdminMemberApprovals.css';

const AdminMemberApprovals = () => {
  const navigate = useNavigate();
  const [pendingSignups, setPendingSignups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [approvingId, setApprovingId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);
  const [showConfirmReject, setShowConfirmReject] = useState(null);
  const [approvalDetails, setApprovalDetails] = useState(null);

  useEffect(() => {
    fetchPendingSignups();
  }, []);

  const fetchPendingSignups = async () => {
    try {
      setLoading(true);
      setError('');
      const signups = await memberService.getPendingSignups();
      setPendingSignups(signups);
    } catch (err) {
      console.error('Error fetching pending signups:', err);
      const errorMessage = err.message || 'Failed to load pending signups. Please try again.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (memberId) => {
    try {
      setApprovingId(memberId);
      setError('');
      const approvedMember = await memberService.approveMemberSignup(memberId);
      
      // Show credentials
      setApprovalDetails({
        member: approvedMember,
        credentials: approvedMember.credentials,
      });
      
      // Refresh the list
      fetchPendingSignups();
      setSuccessMessage(`${approvedMember.name} has been approved!`);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error approving member:', err);
      setError(err.message || 'Failed to approve member. Please try again.');
    } finally {
      setApprovingId(null);
    }
  };

  const handleRejectConfirm = async (memberId) => {
    try {
      setRejectingId(memberId);
      setError('');
      await memberService.rejectMemberSignup(memberId);
      
      // Refresh the list
      fetchPendingSignups();
      setSuccessMessage('Signup has been rejected.');
      setShowConfirmReject(null);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Error rejecting member:', err);
      setError(err.message || 'Failed to reject member. Please try again.');
    } finally {
      setRejectingId(null);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="admin-member-approvals">
      <div className="approvals-container">
        <h1 className="page-title">Member Signup Approvals</h1>
        <p className="page-subtitle">
          Review and approve pending member registrations
        </p>

        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        {loading ? (
          <div className="loading">
            <div className="spinner"></div>
            <p>Loading pending signups...</p>
          </div>
        ) : pendingSignups.length === 0 ? (
          <div className="no-data">
            <div className="no-data-icon">✓</div>
            <p>No pending signups at this time.</p>
          </div>
        ) : (
          <div className="approvals-table-wrapper">
            <table className="approvals-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Signup Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingSignups.map((signup) => (
                  <tr key={signup.id} className="signup-row">
                    <td className="name-cell">
                      <span className="member-name">{signup.name}</span>
                    </td>
                    <td className="email-cell">{signup.email}</td>
                    <td className="phone-cell">{signup.phone}</td>
                    <td className="date-cell">{formatDate(signup.createdAt)}</td>
                    <td className="actions-cell">
                      <button
                        className="btn btn-approve"
                        onClick={() => handleApprove(signup.id)}
                        disabled={approvingId === signup.id || rejectingId === signup.id}
                      >
                        {approvingId === signup.id ? 'Approving...' : '✓ Approve'}
                      </button>
                      <button
                        className="btn btn-reject"
                        onClick={() => setShowConfirmReject(signup.id)}
                        disabled={approvingId === signup.id || rejectingId === signup.id}
                      >
                        ✗ Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Approval Details Modal */}
      {approvalDetails && (
        <div className="approval-modal-overlay" onClick={() => setApprovalDetails(null)}>
          <div className="approval-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Member Approved Successfully!</h2>
              <button
                className="modal-close"
                onClick={() => setApprovalDetails(null)}
              >
                ×
              </button>
            </div>

            <div className="modal-content">
              <div className="approval-success-icon">✓</div>

              <div className="member-info">
                <h3>{approvalDetails.member.name}</h3>
                <p className="info-email">{approvalDetails.member.email}</p>
              </div>

              <div className="credentials-section">
                <h4>Portal Credentials</h4>
                <p className="credentials-note">
                  Share these credentials with the member:
                </p>

                <div className="credential-item">
                  <label>Username:</label>
                  <div className="credential-value">
                    <span>{approvalDetails.credentials.username}</span>
                    <button
                      className="copy-btn"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          approvalDetails.credentials.username
                        );
                      }}
                      title="Copy username"
                    >
                      📋
                    </button>
                  </div>
                </div>

                <div className="credential-item">
                  <label>Password:</label>
                  <div className="credential-value">
                    <span>{approvalDetails.credentials.password}</span>
                    <button
                      className="copy-btn"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          approvalDetails.credentials.password
                        );
                      }}
                      title="Copy password"
                    >
                      📋
                    </button>
                  </div>
                </div>
              </div>

              <div className="credentials-warning">
                <strong>⚠️ Security Note:</strong>
                <p>
                  The member should change their password immediately after first login.
                </p>
              </div>

              <button
                className="btn btn-primary-large"
                onClick={() => setApprovalDetails(null)}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Reject Modal */}
      {showConfirmReject && (
        <div className="reject-modal-overlay" onClick={() => setShowConfirmReject(null)}>
          <div className="reject-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Confirm Rejection</h2>
              <button
                className="modal-close"
                onClick={() => setShowConfirmReject(null)}
              >
                ×
              </button>
            </div>

            <div className="modal-content">
              <p className="confirm-text">
                Are you sure you want to reject this signup? This action cannot be undone.
              </p>

              <div className="modal-actions">
                <button
                  className="btn btn-cancel"
                  onClick={() => setShowConfirmReject(null)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-reject-confirm"
                  onClick={() => handleRejectConfirm(showConfirmReject)}
                  disabled={rejectingId === showConfirmReject}
                >
                  {rejectingId === showConfirmReject ? 'Rejecting...' : 'Reject'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMemberApprovals;
