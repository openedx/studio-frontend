import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';

document.write('<!doctype html><html><body><script type="application/json" id="SFE_i18n_messages">{"testMessage": "Hola"}</script><script type="application/json" id="SFE_i18n_localeScript">{"locale": "fr","data": ""}</script><div id="root" class="SFE"></div></body></html>');
Enzyme.configure({ adapter: new Adapter() });
