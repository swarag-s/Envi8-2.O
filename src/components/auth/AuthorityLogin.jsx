import { UserCog, Building } from 'lucide-react';
import './AuthorityLogin.css';

const AuthorityLogin = ({ onSelectWardMember, onSelectDepartment }) => {
    return (
        <div className="auth-form-container">
            <div className="auth-header">
                <h2>Authority (LSG) Access</h2>
                <p>Select your role to access the administrative dashboard</p>
            </div>

            <div className="authority-selection">
                <button
                    className="authority-card"
                    onClick={onSelectWardMember}
                >
                    <div className="authority-icon ward-member">
                        <UserCog size={48} />
                    </div>
                    <h3>Ward Member</h3>
                    <p>Access ward-level issue management and citizen engagement tools</p>
                    <div className="card-arrow">→</div>
                </button>

                <button
                    className="authority-card"
                    onClick={onSelectDepartment}
                >
                    <div className="authority-icon department">
                        <Building size={48} />
                    </div>
                    <h3>Department</h3>
                    <p>Access department dashboard for issue resolution and tracking</p>
                    <div className="card-arrow">→</div>
                </button>
            </div>

            <div className="authority-info">
                <div className="info-box">
                    <h4>First time here?</h4>
                    <p>
                        Contact your System Administrator to get your credentials and access
                        to the administrative portal.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AuthorityLogin;
