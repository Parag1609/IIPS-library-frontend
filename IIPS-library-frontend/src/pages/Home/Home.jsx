import { Link } from "react-router-dom";
import "./../../App.css";

export default function Home() {
  return (
    <div className="home">
      <div className="header">
        <h1>Welcome to IIPS Library</h1>
      </div>
      <div className="menu">
        <Link to="/membership"><button>Membership</button></Link>
        <Link to="/transaction"><button>Transaction</button></Link>
        <Link to="/catalogue"><button>Catalogue</button></Link>
        <Link to="/search"><button>Search Book</button></Link>
      </div>
    </div>
  );
}
