import styled from "@emotion/styled";

const Boton = styled.button`
  display: block;
  width: 100%;
  font-weight: 700;
  text-transform: uppercase;
  border: 1px solid #d1d1d1;
  padding: 1rem 2rem;
  margin: 2rem auto;
  text-align: center;
  background-color: ${(props) => (props.bgColor ? "#DA552F" : "white")};
  color: ${(props) => (props.bgColor ? "white" : "#000")};

  &:last-of-type {
    margin-right: 0;
  }

  &:hover {
    cursor: pointer;
    background-color: ${(props) => (props.bgColor ? "#ae4425" : "#000")};
    color: ${(props) => (props.bgColor ? "#FFFF" : "#000")};
    color: ${(props) => props.votos && "#fff"};
  }
`;

export default Boton;
