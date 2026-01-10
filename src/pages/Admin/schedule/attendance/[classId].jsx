"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Typography,
  Checkbox,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import {
  fetchSessions,
  fetchSessionAttendance,
  saveAttendance,
} from "./api/adminAttendanceApi";

import AdminLayout from "../../AdminLayout";

// Chrome-style Tabs Component
const ChromeTabs = ({ sessions, activeSession, onChange }) => {
  return (
    <Box sx={{ width: '100%', overflowX: 'auto', mb: 3 }}>
      <Box
        sx={{
          display: 'flex',
          gap: '2px',
          backgroundColor: '#e5e7eb',
          padding: '4px',
          borderTopLeftRadius: '8px',
          borderTopRightRadius: '8px',
          minWidth: 'max-content',
        }}
      >
        {sessions.map((session) => {
          const isActive = activeSession === session.sessionId;
          return (
            <Box
              key={session.sessionId}
              component="button"
              onClick={() => onChange(session.sessionId)}
              sx={{
                position: 'relative',
                padding: '12px 24px',
                minWidth: '140px',
                borderTopLeftRadius: '8px',
                borderTopRightRadius: '8px',
                transition: 'all 0.2s',
                fontWeight: 500,
                fontSize: '14px',
                border: 'none',
                cursor: 'pointer',
                backgroundColor: isActive ? '#ffffff' : '#f3f4f6',
                color: isActive ? '#111827' : '#6b7280',
                boxShadow: isActive ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
                zIndex: isActive ? 10 : 1,
                clipPath: isActive 
                  ? 'polygon(8px 0%, calc(100% - 8px) 0%, 100% 100%, 0% 100%)'
                  : 'none',
                '&:hover': {
                  backgroundColor: isActive ? '#ffffff' : '#f9fafb',
                },
              }}
            >
              <Box
                component="span"
                sx={{
                  display: 'block',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {new Date(session.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default function AttendancePage() {
  const router = useRouter();
  const { classId, startTime } = router.query;

  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [attendance, setAttendance] = useState(null);
  const [loading, setLoading] = useState(true);

  console.log(attendance, "data");

  /* ---------- HANDLE ATTENDANCE CHANGE ---------- */
  const handleAttendanceChange = async (bookingId, sessionId, attended) => {
    // Optimistically update UI immediately
    setAttendance(prev => ({
      ...prev,
      students: prev.students.map(student =>
        student.bookingId === bookingId
          ? { ...student, attended }
          : student
      )
    }));

    // Save to backend
    try {
      await saveAttendance({
        bookingId,
        sessionId,
        attended
      });
    } catch (error) {
      console.error('Failed to save attendance:', error);
      // Revert on error
      setAttendance(prev => ({
        ...prev,
        students: prev.students.map(student =>
          student.bookingId === bookingId
            ? { ...student, attended: !attended }
            : student
        )
      }));
    }
  };

  /* ---------- LOAD SESSIONS ---------- */
  useEffect(() => {
    if (!classId || !startTime) return;

    fetchSessions(classId, startTime).then((res) => {
      setSessions(res);
      if (res.length > 0) {
        setActiveSession(res[0].sessionId);
      }
    });
  }, [classId, startTime]);

  /* ---------- LOAD ATTENDANCE ---------- */
  useEffect(() => {
    if (!activeSession) return;

    setLoading(true);
    fetchSessionAttendance(activeSession)
      .then(setAttendance)
      .finally(() => setLoading(false));
  }, [activeSession]);

  if (loading || !attendance) {
    return (
      <AdminLayout>
        <Typography p={4}>Loading attendance…</Typography>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box p={3}>
        <Typography variant="h5" mb={3} fontWeight={600}>
          {attendance.className} • {attendance.venue}
        </Typography>

        {/* ---------- CHROME-STYLE TABS ---------- */}
        <ChromeTabs
          sessions={sessions}
          activeSession={activeSession}
          onChange={setActiveSession}
        />

        {/* ---------- MODERN ATTENDANCE TABLE ---------- */}
        <Box
          sx={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ overflowX: 'auto' }}>
            <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
              <Box component="thead" sx={{ backgroundColor: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <Box component="tr">
                  <Box
                    component="th"
                    sx={{
                      px: 3,
                      py: 2,
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: 500,
                      color: '#6b7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Child
                  </Box>
                  <Box
                    component="th"
                    sx={{
                      px: 3,
                      py: 2,
                      textAlign: 'left',
                      fontSize: '12px',
                      fontWeight: 500,
                      color: '#6b7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Age
                  </Box>
                  <Box
                    component="th"
                    sx={{
                      px: 3,
                      py: 2,
                      textAlign: 'center',
                      fontSize: '12px',
                      fontWeight: 500,
                      color: '#6b7280',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Attended
                  </Box>
                </Box>
              </Box>
              <Box component="tbody" sx={{ '& tr': { borderBottom: '1px solid #e5e7eb' } }}>
                {attendance.students.map((row) => (
                  <Box
                    component="tr"
                    key={row.bookingId}
                    sx={{
                      '&:hover': {
                        backgroundColor: '#f9fafb',
                      },
                      transition: 'background-color 0.2s',
                    }}
                  >
                    <Box
                      component="td"
                      sx={{
                        px: 3,
                        py: 2,
                        whiteSpace: 'nowrap',
                        fontSize: '14px',
                        fontWeight: 500,
                        color: '#111827',
                      }}
                    >
                      {row.childName}
                    </Box>
                    <Box
                      component="td"
                      sx={{
                        px: 3,
                        py: 2,
                        whiteSpace: 'nowrap',
                        fontSize: '14px',
                        color: '#6b7280',
                      }}
                    >
                      {row.age}
                    </Box>
                    <Box
                      component="td"
                      sx={{
                        px: 3,
                        py: 2,
                        whiteSpace: 'nowrap',
                        textAlign: 'center',
                      }}
                    >
                      <Checkbox
                        checked={row.attended}
                        onChange={(e) =>
                          handleAttendanceChange(
                            row.bookingId,
                            attendance.sessionId,
                            e.target.checked
                          )
                        }
                        sx={{
                          color: '#d1d5db',
                          '&.Mui-checked': {
                            color: '#2563eb',
                          },
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>

        {/* ---------- STUDENT DETAILS ACCORDIONS ---------- */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" mb={2} fontWeight={600}>
            Student Details
          </Typography>

          {/* Health Questionnaire Accordion */}
          <Accordion
            sx={{
              mb: 1,
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              '&:before': { display: 'none' },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                backgroundColor: '#f9fafb',
                '&:hover': {
                  backgroundColor: '#f3f4f6',
                },
              }}
            >
              <Typography sx={{ fontWeight: 500, fontSize: '15px',color:'black' }}>
                Health Questionnaire
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ backgroundColor: '#ffffff' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {attendance.students.map((student) => (
                  <Box
                    key={student.bookingId}
                    sx={{
                      p: 2,
                      backgroundColor: '#f9fafb',
                      borderRadius: '6px',
                      borderLeft: '3px solid #2563eb',
                    }}
                  >
                    <Typography sx={{ fontWeight: 600, fontSize: '14px', mb: 0.5, color: '#111827' }}>
                      {student.childName} (Age {student.age})
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <Typography sx={{ fontSize: '13px', color: '#6b7280', fontWeight: 500 }}>
                        Health:
                      </Typography>
                      <Typography sx={{ fontSize: '13px', color: '#374151' }}>
                        {student.health || 'No health information provided'}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Email List Accordion */}
          <Accordion
            sx={{
              mb: 1,
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              '&:before': { display: 'none' },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                backgroundColor: '#f9fafb',
                '&:hover': {
                  backgroundColor: '#f3f4f6',
                },
              }}
            >
              <Typography sx={{ fontWeight: 500, fontSize: '15px',color:'black' }}>
                Email List
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ backgroundColor: '#ffffff' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {attendance.students.map((student) => (
                  <Box
                    key={student.bookingId}
                    sx={{
                      p: 2,
                      backgroundColor: '#f9fafb',
                      borderRadius: '6px',
                      borderLeft: '3px solid #10b981',
                    }}
                  >
                    <Typography sx={{ fontWeight: 600, fontSize: '14px', mb: 0.5, color: '#111827' }}>
                      {student.childName} (Age {student.age})
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <Typography sx={{ fontSize: '13px', color: '#6b7280', fontWeight: 500 }}>
                        Email:
                      </Typography>
                      <Typography sx={{ fontSize: '13px', color: '#374151', wordBreak: 'break-all' }}>
                        {student.email || 'No email provided'}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>

          {/* Phone Number List Accordion */}
          <Accordion
            sx={{
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
              '&:before': { display: 'none' },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                backgroundColor: '#f9fafb',
                '&:hover': {
                  backgroundColor: '#f3f4f6',
                },
              }}
            >
              <Typography sx={{ fontWeight: 500, fontSize: '15px',color:'black' }}>
                Phone Number List
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ backgroundColor: '#ffffff' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {attendance.students.map((student) => (
                  <Box
                    key={student.bookingId}
                    sx={{
                      p: 2,
                      backgroundColor: '#f9fafb',
                      borderRadius: '6px',
                      borderLeft: '3px solid #f59e0b',
                    }}
                  >
                    <Typography sx={{ fontWeight: 600, fontSize: '14px', mb: 0.5, color: '#111827' }}>
                      {student.childName} (Age {student.age})
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                      <Typography sx={{ fontSize: '13px', color: '#6b7280', fontWeight: 500 }}>
                        Phone:
                      </Typography>
                      <Typography sx={{ fontSize: '13px', color: '#374151' }}>
                        {student.phonenumber || 'No phone number provided'}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Box>
    </AdminLayout>
  );
}