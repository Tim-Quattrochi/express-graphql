import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import { useMutation, gql } from "@apollo/client";

interface RegisterData {
  register: {
    id: string;
    email: string;
  };
  createUser: {
    id: string;
    email: string;
  };
}

interface RegisterVariables {
  name: string;
  email: string;
  password: string;
}

const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(input: { email: $email, password: $password }) {
      token
      user {
        id
        name
        email
      }
    }
  }
`;

const REGISTER_MUTATION = gql`
  mutation Register(
    $name: String!
    $email: String!
    $password: String!
  ) {
    createUser(
      input: { name: $name, email: $email, password: $password }
    ) {
      id
      email
    }
  }
`;

function Register() {
  const [formState, setFormState] = useState({
    login: true,
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  // Use the RegisterData and RegisterVariables interfaces with useMutation
  const [register] = useMutation<RegisterData, RegisterVariables>(
    REGISTER_MUTATION,
    {
      onCompleted: ({ createUser }) => {
        login({
          variables: {
            email: createUser.email,
            password: formState.password,
          },
        });
      },
    }
  );

  const [login] = useMutation(LOGIN_MUTATION, {
    variables: {
      email: formState.email,
      password: formState.password,
    },
    onCompleted: ({ login }) => {
      localStorage.setItem("auth-token", login.token);
      navigate("/dashboard");
    },
  });

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (formState.login) {
      login();
    } else {
      register({ variables: formState });
    }
  }
  return (
    <div>
      <h1>{formState.login ? "Login" : "Register"}</h1>
      <form onSubmit={handleSubmit}>
        {!formState.login && (
          <input
            type="text"
            name="name"
            value={formState.name}
            onChange={handleInputChange}
            placeholder="name"
            required
          />
        )}
        <input
          type="email"
          name="email"
          value={formState.email}
          onChange={handleInputChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={formState.password}
          onChange={handleInputChange}
          placeholder="Password"
          required
        />

        <button type="submit">
          {formState.login ? "Login" : "Register"}
        </button>
      </form>
      {formState.login ? (
        <p>
          Don't have an account?{" "}
          <button
            onClick={() =>
              setFormState({ ...formState, login: false })
            }
          >
            Register
          </button>
        </p>
      ) : (
        <p>
          Already have an account?{" "}
          <button
            onClick={() =>
              setFormState({ ...formState, login: true })
            }
          >
            Login
          </button>
        </p>
      )}
    </div>
  );
}

export default Register;
