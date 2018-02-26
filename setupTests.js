import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';

document.write('<!doctype html><html><body><script type="application/json" id="SFE_i18n_data">{"locale": "fr", "messages": {"testMessage": "Hola"}}</script><div id="root" class="SFE"></div></body></html>');
Enzyme.configure({ adapter: new Adapter() });
