/**
 * Members List Component
 * Display and manage church members
 */

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setMembers, deleteMember, setSearchTerm, setFilters, updateMember } from '../../redux/slices/memberSlice';
import { 
  getAllMembers, 
  deleteMember as deleteMemberService,
  generateMemberCredentials,
  resetMemberCredentials,
  revokeMemberAccess
} from '../../services/memberService.firebase';
import MemberModal from './MemberModal';
import CredentialsModal from './CredentialsModal';
import './Members.css';

const Members = () => {
  const dispatch = useDispatch();
  const { filteredMembers, searchTerm, filters } = useSelector((state) => state.members);
  const [showModal, setShowModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCredentials, setShowCredentials] = useState(false);
  const [credentials, setCredentials] = useState(null);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      setLoading(true);
      const data = await getAllMembers();
      dispatch(setMembers(data));
    } catch (error) {
      console.error('Error loading members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = () => {
    setSelectedMember(null);
    setShowModal(true);
  };

  const handleEditMember = (member) => {
    setSelectedMember(member);
    setShowModal(true);
  };

  const handleDeleteMember = async (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await deleteMemberService(id);
        dispatch(deleteMember(id));
      } catch (error) {
        console.error('Error deleting member:', error);
      }
    }
  };

  const handleSearch = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };

  const handleFilterChange = (filterName, value) => {
    dispatch(setFilters({ [filterName]: value }));
  };

  const handleGenerateCredentials = async (member) => {
    try {
      const updatedMember = await generateMemberCredentials(member.id);
      dispatch(updateMember(updatedMember));
      setCredentials({
        ...updatedMember.credentials,
        phone: updatedMember.phone,
        name: updatedMember.name || `${updatedMember.firstName || ''} ${updatedMember.lastName || ''}`.trim(),
        email: updatedMember.email,
      });
      setShowCredentials(true);
      alert('✅ Credentials generated! Email notification sent to member.');
    } catch (error) {
      alert('Failed to generate credentials: ' + error.message);
    }
  };

  const handleResetCredentials = async (member) => {
    if (window.confirm('Are you sure you want to reset this member\'s password?')) {
      try {
        const updatedMember = await resetMemberCredentials(member.id);
        dispatch(updateMember(updatedMember));
        setCredentials({
          ...updatedMember.credentials,
          phone: updatedMember.phone,
          name: updatedMember.name || `${updatedMember.firstName || ''} ${updatedMember.lastName || ''}`.trim(),
          email: updatedMember.email,
        });
        setShowCredentials(true);
        alert('✅ Password reset! Email notification sent to member.');
      } catch (error) {
        alert('Failed to reset credentials: ' + error.message);
      }
    }
  };

  const handleRevokeAccess = async (member) => {
    if (window.confirm('Are you sure you want to revoke portal access for this member?')) {
      try {
        const updatedMember = await revokeMemberAccess(member.id);
        dispatch(updateMember(updatedMember));
        alert('✅ Portal access revoked.');
      } catch (error) {
        alert('Failed to revoke access: ' + error.message);
      }
    }
  };

  const handleViewCredentials = (member) => {
    if (member.credentials) {
      setCredentials({
        ...member.credentials,
        phone: member.phone,
        name: member.name || `${member.firstName || ''} ${member.lastName || ''}`.trim(),
        email: member.email,
      });
      setShowCredentials(true);
    }
  };

  if (loading) {
    return <div className="loading">Loading members...</div>;
  }

  return (
    <div className="members-container">
      <div className="members-header">
        <h2>Members Management</h2>
        <button onClick={handleAddMember} className="btn-primary">
          ➕ Add Member
        </button>
      </div>

      <div className="members-filters">
        <input
          type="text"
          placeholder="Search members..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="filter-select"
        >
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Inactive">Inactive</option>
        </select>
        <select
          value={filters.membershipType}
          onChange={(e) => handleFilterChange('membershipType', e.target.value)}
          className="filter-select"
        >
          <option value="all">All Types</option>
          <option value="Regular">Regular</option>
          <option value="Youth">Youth</option>
          <option value="Senior">Senior</option>
        </select>
      </div>

      <div className="members-table-container">
        <table className="members-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Type</th>
              <th>Join Date</th>
              <th>Portal Access</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMembers.length > 0 ? (
              filteredMembers.map((member) => (
                <tr key={member.id}>
                  <td>{member.firstName} {member.lastName}</td>
                  <td>{member.email}</td>
                  <td>{member.phone}</td>
                  <td>
                    <span className={`status-badge ${member.status.toLowerCase()}`}>
                      {member.status}
                    </span>
                  </td>
                  <td>{member.membershipType}</td>
                  <td>{new Date(member.joinDate).toLocaleDateString()}</td>
                  <td>
                    {member.hasPortalAccess ? (
                      <>
                        <span className="portal-access-yes">✓ Yes</span>
                        <button 
                          onClick={() => handleViewCredentials(member)}
                          className="btn-icon"
                          title="View Credentials"
                        >
                          🔑
                        </button>
                        <button 
                          onClick={() => handleResetCredentials(member)}
                          className="btn-icon"
                          title="Reset Password"
                        >
                          🔄
                        </button>
                        <button 
                          onClick={() => handleRevokeAccess(member)}
                          className="btn-icon btn-danger"
                          title="Revoke Access"
                        >
                          🚫
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="portal-access-no">✗ No</span>
                        <button 
                          onClick={() => handleGenerateCredentials(member)}
                          className="btn-icon btn-success"
                          title="Generate Credentials"
                        >
                          ➕
                        </button>
                      </>
                    )}
                  </td>
                  <td>
                    <button
                      onClick={() => handleEditMember(member)}
                      className="btn-action btn-edit"
                    >
                      ✏️ Edit
                    </button>
                    <button
                      onClick={() => handleDeleteMember(member.id)}
                      className="btn-action btn-delete"
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="no-data">
                  No members found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <MemberModal
          member={selectedMember}
          onClose={() => setShowModal(false)}
          onRefresh={loadMembers}
        />
      )}

      {showCredentials && credentials && (
        <CredentialsModal
          credentials={credentials}
          onClose={() => {
            setShowCredentials(false);
            setCredentials(null);
          }}
        />
      )}
    </div>
  );
};

export default Members;
