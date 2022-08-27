# Dashboard

```html markup
<div style="margin: 2rem 0">
  <div id="workflow"></div>
</div>
<link
  rel="stylesheet"
  href="https://unpkg.com/frictionless-components/dist/frictionless-components.css"
/>
<script src="https://unpkg.com/frictionless-components/dist/frictionless-components.js"></script>
<script>
if (document.readyState === 'complete') location.reload()
if (document.readyState === 'loading') window.addEventListener("load", () => {
  const value = 'Z2hwXzVkQ3BTZUoxTURJNlF3MzlwOWlqVmlxU2YwcnpnaTNSVklBcA=='
  const params = new URLSearchParams(window.location.search)
  const user = params.get('user')
  const repo = params.get('repo')
  const flow = params.get('flow')
  const run = params.get('run')
  const callback = (error, {user, repo, flow, run}) => {
    const params = new URLSearchParams(location.search)
    params.set('user', user)
    params.set('repo', repo)
    params.set('flow', flow)
    if (run) params.set('run', run)
    const url = location.pathname + '?' + params.toString()
    window.history.replaceState({}, '',  url)
  }
  const element = document.getElementById('workflow')
  const props = { token: atob(value), user, repo, flow, run, callback }
  frictionlessComponents.render(frictionlessComponents.Workflow, props, element)
})
</script>
```
