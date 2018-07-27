import R from 'render-js/src/class.es';
//import {toStr} from '/lib/enonic/util';
import {forceArray} from '/lib/enonic/util/data';
import {getComponent} from '/lib/xp/portal';


export function get(req) {
    const {config, regions} = getComponent(); //log.info(toStr({config, regions}));
    const containerTag = config.containerTag || 'div';
    const {
        alignContent, alignItems, flexDirection, flexWrap, justifyContent
    } = config;
    const items = config.regions ? forceArray(config.regions) : []; //log.info(toStr({items}));
    const r = R.render(R[containerTag](
        {
            _s: {
                display: [
                    '-webkit-box',
                    '-moz-box',
                    '-ms-flexbox',
                    '-webkit-flex',
                    'flex'
                ],
                alignContent,
                alignItems,
                flexDirection,
                flexWrap,
                justifyContent
            }
        }, items.map((item, i) => {
            //log.info(toStr({item}));
            const name = `flexbox${i + 1}`;
            const mediaQueries = item.mediaQueries ? forceArray(item.mediaQueries) : []; //log.info(toStr({mediaQueries}));
            const {components} = regions[name]; //log.info(toStr({name, components}));
            const media = {};
            mediaQueries.forEach((mediaQuery) => {
                //log.info(toStr({mediaQuery}));
                const mediaQueryMinWidth = mediaQuery.mediaQueryMinWidth || 0; //log.info(toStr({mediaQueryMinWidth}));
                const {
                    alignSelf,
                    //flex,
                    flexBasis,
                    flexGrow,
                    flexShrink,
                    order
                } = mediaQuery; //log.info(toStr({order}));
                media[`minWidth${mediaQueryMinWidth}`] = {
                    alignSelf,
                    /*'-webkit-box-flex': flex,
                    '-moz-box-flex': flex,
                    '-webkit-flex': flex,
                    '-ms-flex': flex,
                    flex,*/
                    flexBasis,
                    flexGrow,
                    flexShrink,
                    '-webkit-box-ordinal-group': order,
                    '-moz-box-ordinal-group': order,
                    '-ms-flex-order': order,
                    '-webkit-order': order,
                    order
                };
            });
            const {
                alignSelf,
                //flex,
                flexBasis,
                flexGrow,
                flexShrink,
                order
            } = item;
            return R[item.itemTag || 'div']({
                dataPortalRegion: req.mode === 'edit' ? name : null,
                _s: {
                    alignSelf,
                    /*'-webkit-box-flex': flex,
                    '-moz-box-flex': flex,
                    '-webkit-flex': flex,
                    '-ms-flex': flex,
                    flex,*/
                    flexBasis,
                    flexGrow,
                    flexShrink,
                    '-webkit-box-ordinal-group': order,
                    '-moz-box-ordinal-group': order,
                    '-ms-flex-order': order,
                    '-webkit-order': order,
                    order
                },
                _m: media
            }, (components && components.length)
                ? components.map(c => `<!--# COMPONENT ${c.path} -->`)
                : '');
        }) // map
    ));
    return {
        body: r.html,
        contentType: 'text/html; charset=utf-8',
        pageContributions: {
            headEnd: [
                R.render(R.style(
                    {type: 'text/css'},
                    r.css.join('')
                )).html
            ]
        } // pageContributions
    }; // return
} // function get
