const ContextList: {
  name: string;
  context: React.ComponentType<{ children: React.ReactNode }>;
}[] = [
  // { name: "LoginContextProvider", context: LoginContextProvider },
  // { name: "SkillAndResortContext", context: SkillAndResortContextProvider },
];

function Context(props: { children: React.ReactNode }) {
  let output = props.children;
  ContextList.forEach((contextInfo) => {
    const ContextComponent = contextInfo.context;
    output = <ContextComponent>{output}</ContextComponent>;
  });
  return output;
}

export {};

export default Context;
