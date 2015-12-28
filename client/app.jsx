// Create the lokka client
SysInfoSchema = GraphQL.createLokkaClient('SysInfo');

// Create a stateless component
SysInfoComponent = ({sysInfo}) => (
  <div>
    <h1>System Information</h1>
    <ul>
      <li>Hostname: {sysInfo.hostname}</li>
      <li>Uptime: {sysInfo.uptime} seconds</li>
      <li>Memory: {sysInfo.memory} MB</li>
      <li>Load Average: {sysInfo.loadavg.min1} </li>
    </ul>
  </div>
);

// Create a fragment with the data we need
SysInfoComponent.fragment = SysInfoSchema.createFragment(`
  fragment on SysInfo {
    hostname,
    memory,
    uptime,
    loadavg {
      min1
    }
  }
`);

// bind the above component with a GraphQL query
SysInfoContainer = GraphQL.bindData((props, onData) => {
  return SysInfoSchema.watchQuery(SysInfoContainer.query, onData)
})(SysInfoComponent);

SysInfoContainer.query = `
  {
    sysInfo {
        ...${SysInfoComponent.fragment}
    }
  }
`;

// Render the above container
Meteor.startup(() => {
  ReactDOM.render(<SysInfoContainer />, document.body);
});

// Refetch the query for every 2 seconds
setInterval(() => {
  SysInfoSchema.refetchQuery(SysInfoContainer.query);
}, 1000 * 2);