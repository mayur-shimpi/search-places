import './style.css';

const ResponsiveContainer = ({ children }) => {
    return (
        <div className="custom-responsive-container">
            {children}
        </div>
    );
};

export default ResponsiveContainer;
