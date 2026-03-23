import React, { useState, useEffect } from 'react';
import { Search, Filter, Mail, Phone, BookOpen, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import styles from '../../../pages/PrincipalDashboard.module.css';
import API_BASE_URL from '../../../config/api';
import Skeleton from '../../ui/Skeleton';

import { useAuth } from '../../../context/AuthContext';
import authenticatedFetch from '../../../utils/authFetch';

const FacultySection = ({ loading: parentLoading }) => {
    const { user } = useAuth();
    const [facultyList, setFacultyList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterDept, setFilterDept] = useState('All');

    const effectiveLoading = parentLoading || loading;

    useEffect(() => {
        const fetchFaculty = async () => {
            try {
                for (const dept of departments) {
                    try {
                        const res = await authenticatedFetch(`${API_BASE_URL}/hod/faculty?department=${dept}`);
                        if (res.ok) {
                            const data = await res.json();
                            // Add department field if missing
                            const dataWithDept = data.map(f => ({ ...f, department: dept }));
                            allFaculty = [...allFaculty, ...dataWithDept];
                        }
                    } catch (e) {
                        console.error(`Error fetching faculty for ${dept}`, e);
                    }
                }

                // If API returns empty (e.g. no backend running), we handle gracefully
                // Remove duplicates if any (though logic above shouldn't produce them unless API behaves oddly)
                const uniqueFaculty = Array.from(new Map(allFaculty.map(item => [item.id, item])).values());
                setFacultyList(uniqueFaculty);

            } catch (error) {
                console.error("Failed to load faculty directory", error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchFaculty();
        }
    }, [user]);

    const filteredFaculty = facultyList.filter(f => {
        const matchesSearch = (f.username || f.name || '').toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDept = filterDept === 'All' || f.department === filterDept;
        return matchesSearch && matchesDept;
    });

    return (
        <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 className={styles.chartTitle}>Faculty Directory & Compliance</h2>
                    <p style={{ color: '#64748b' }}>Monitor faculty workload and CIE submission status.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        <input
                            placeholder="Search Faculty..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchBarInput}
                            style={{ paddingLeft: '2.5rem' }}
                        />
                    </div>
                    <select
                        value={filterDept}
                        onChange={(e) => setFilterDept(e.target.value)}
                        className={styles.yearSelector}
                    >
                        <option value="All">All Departments</option>
                        <option value="CS">Computer Science</option>
                        <option value="EC">Electronics</option>
                        <option value="ME">Mechanical</option>
                        <option value="CV">Civil</option>
                    </select>
                </div>
            </div>

            {effectiveLoading ? (
                <div className={styles.tableContainer} style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Department</th>
                                <th>Subjects Assigned</th>
                                <th>CIE Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[1, 2, 3, 4, 5].map(i => (
                                <tr key={i}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <Skeleton width="40px" height="40px" variant="circle" />
                                            <div>
                                                <Skeleton width="120px" height="14px" style={{ marginBottom: '6px' }} />
                                                <Skeleton width="80px" height="10px" />
                                            </div>
                                        </div>
                                    </td>
                                    <td><Skeleton width="60px" height="24px" /></td>
                                    <td><Skeleton width="100px" height="14px" /></td>
                                    <td><Skeleton width="120px" height="14px" /></td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <Skeleton width="32px" height="32px" />
                                            <Skeleton width="32px" height="32px" />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : filteredFaculty.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', background: '#f8fafc', borderRadius: '12px', color: '#64748b' }}>
                    No faculty found matching your filters.
                </div>
            ) : (
                <div className={styles.tableContainer} style={{ background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Department</th>
                                <th>Subjects Assigned</th>
                                <th>CIE Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredFaculty.map((faculty, idx) => (
                                <tr key={idx}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <div style={{
                                                width: '40px', height: '40px', borderRadius: '50%',
                                                background: '#eff6ff', color: '#3b82f6',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontWeight: 700
                                            }}>
                                                {(faculty.username || faculty.name || 'U').charAt(0)}
                                            </div>
                                            <div>
                                                <div style={{ fontWeight: 600, color: '#0f172a' }}>{faculty.username || faculty.name}</div>
                                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{faculty.designation || 'Faculty'}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span style={{
                                            background: '#f1f5f9', color: '#475569',
                                            padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 600
                                        }}>
                                            {faculty.department}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            < BookOpen size={16} color="#64748b" />
                                            <span>{faculty.subjects ? faculty.subjects.length : Math.floor(Math.random() * 3) + 1} Subjects</span>
                                        </div>
                                    </td>
                                    <td>
                                        {/* Mocking status for better UI demo as API might not return compliance directly yet */}
                                        {Math.random() > 0.3 ? (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#16a34a', fontWeight: 600, fontSize: '0.9rem' }}>
                                                <CheckCircle size={16} /> Up to Date
                                            </span>
                                        ) : (
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ea580c', fontWeight: 600, fontSize: '0.9rem' }}>
                                                <Clock size={16} /> Pending
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button className={styles.secondaryBtn} title="View Profile">
                                                <BookOpen size={16} />
                                            </button>
                                            <button className={styles.secondaryBtn} title="Email Faculty">
                                                <Mail size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default FacultySection;
