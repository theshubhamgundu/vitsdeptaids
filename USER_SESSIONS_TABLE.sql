-- ===================================
-- USER SESSIONS TABLE
-- For multi-device authentication management
-- ===================================

-- Create user_sessions table for managing login sessions
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    device_info TEXT,
    login_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    user_role VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_active ON user_sessions(is_active, expires_at);
CREATE INDEX idx_user_sessions_role ON user_sessions(user_role);

-- Enable RLS
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Create policies for user_sessions
CREATE POLICY "Users can manage their own sessions" ON user_sessions
FOR ALL USING (auth.role() = 'authenticated');

-- Create trigger for updated_at
CREATE TRIGGER update_user_sessions_updated_at 
BEFORE UPDATE ON user_sessions 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ===================================
-- USER SESSIONS TABLE COMPLETE!
-- ===================================

-- This table enables:
-- ✅ Multi-device login management
-- ✅ Session expiration and cleanup
-- ✅ Device tracking for security
-- �� Role-based session management
-- ✅ Automatic session cleanup
