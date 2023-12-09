import Particles from "react-particles";
import { loadSlim } from "tsparticles-slim";
import type { Container, Engine } from "tsparticles-engine";
import { use, useCallback, useEffect, useRef, useState } from "react";
import React from "react";

const Particle = ({particleRef}:{particleRef : React.MutableRefObject<any>}) => {
    const particleOptions = [
            // 눈
            {
                "autoPlay": true,
                "background": {
                  "color": {
                    "value": "#333333"
                  },
                  "image": "",
                  "position": "",
                  "repeat": "",
                  "size": "",
                  "opacity": 1
                },
                "backgroundMask": {
                  "composite": "destination-out",
                  "cover": {
                    "color": {
                      "value": "#fff"
                    },
                    "opacity": 1
                  },
                  "enable": false
                },
                "clear": true,
                "defaultThemes": {},
                "delay": 0,
                "fullScreen": {
                  "enable": true,
                  "zIndex": 0
                },
                "detectRetina": true,
                "duration": 0,
                "fpsLimit": 120,
                "interactivity": {
                  "detectsOn": "window",
                  "events": {
                    "onClick": {
                      "enable": false,
                      "mode": []
                    },
                    "onDiv": {
                      "selectors": [],
                      "enable": false,
                      "mode": [],
                      "type": "circle"
                    },
                    "onHover": {
                      "enable": false,
                      "mode": [],
                      "parallax": {
                        "enable": false,
                        "force": 2,
                        "smooth": 10
                      }
                    },
                    "resize": {
                      "delay": 0.5,
                      "enable": true
                    }
                  },
                  "modes": {
                    "trail": {
                      "delay": 1,
                      "pauseOnStop": false,
                      "quantity": 1
                    },
                    "attract": {
                      "distance": 200,
                      "duration": 0.4,
                      "easing": "ease-out-quad",
                      "factor": 1,
                      "maxSpeed": 50,
                      "speed": 1
                    },
                    "bounce": {
                      "distance": 200
                    },
                    "bubble": {
                      "distance": 200,
                      "duration": 0.4,
                      "mix": false,
                      "divs": {
                        "distance": 200,
                        "duration": 0.4,
                        "mix": false,
                        "selectors": []
                      }
                    },
                    "connect": {
                      "distance": 80,
                      "links": {
                        "opacity": 0.5
                      },
                      "radius": 60
                    },
                    "grab": {
                      "distance": 100,
                      "links": {
                        "blink": false,
                        "consent": false,
                        "opacity": 1
                      }
                    },
                    "push": {
                      "default": true,
                      "groups": [],
                      "quantity": 4
                    },
                    "remove": {
                      "quantity": 2
                    },
                    "repulse": {
                      "distance": 200,
                      "duration": 0.4,
                      "factor": 100,
                      "speed": 1,
                      "maxSpeed": 50,
                      "easing": "ease-out-quad",
                      "divs": {
                        "distance": 200,
                        "duration": 0.4,
                        "factor": 100,
                        "speed": 1,
                        "maxSpeed": 50,
                        "easing": "ease-out-quad",
                        "selectors": []
                      }
                    },
                    "slow": {
                      "factor": 3,
                      "radius": 200
                    },
                    "light": {
                      "area": {
                        "gradient": {
                          "start": {
                            "value": "#ffffff"
                          },
                          "stop": {
                            "value": "#000000"
                          }
                        },
                        "radius": 1000
                      },
                      "shadow": {
                        "color": {
                          "value": "#000000"
                        },
                        "length": 2000
                      }
                    }
                  }
                },
                "manualParticles": [],
                "particles": {
                  "bounce": {
                    "horizontal": {
                      "value": 1
                    },
                    "vertical": {
                      "value": 1
                    }
                  },
                  "collisions": {
                    "absorb": {
                      "speed": 2
                    },
                    "bounce": {
                      "horizontal": {
                        "value": 1
                      },
                      "vertical": {
                        "value": 1
                      }
                    },
                    "enable": false,
                    "maxSpeed": 50,
                    "mode": "bounce",
                    "overlap": {
                      "enable": true,
                      "retries": 0
                    }
                  },
                  "color": {
                    "value": "#fff",
                    "animation": {
                      "h": {
                        "count": 0,
                        "enable": false,
                        "speed": 1,
                        "decay": 0,
                        "delay": 0,
                        "sync": true,
                        "offset": 0
                      },
                      "s": {
                        "count": 0,
                        "enable": false,
                        "speed": 1,
                        "decay": 0,
                        "delay": 0,
                        "sync": true,
                        "offset": 0
                      },
                      "l": {
                        "count": 0,
                        "enable": false,
                        "speed": 1,
                        "decay": 0,
                        "delay": 0,
                        "sync": true,
                        "offset": 0
                      }
                    }
                  },
                  "effect": {
                    "close": true,
                    "fill": true,
                    "options": {},
                    "type": []
                  },
                  "groups": {},
                  "move": {
                    "angle": {
                      "offset": 0,
                      "value": 90
                    },
                    "attract": {
                      "distance": 200,
                      "enable": false,
                      "rotate": {
                        "x": 3000,
                        "y": 3000
                      }
                    },
                    "center": {
                      "x": 50,
                      "y": 50,
                      "mode": "percent",
                      "radius": 0
                    },
                    "decay": 0,
                    "distance": {},
                    "direction": "bottom",
                    "drift": 0,
                    "enable": true,
                    "gravity": {
                      "acceleration": 9.81,
                      "enable": false,
                      "inverse": false,
                      "maxSpeed": 50
                    },
                    "path": {
                      "clamp": true,
                      "delay": {
                        "value": 0
                      },
                      "enable": false,
                      "options": {}
                    },
                    "outModes": {
                      "default": "out",
                      "bottom": "out",
                      "left": "out",
                      "right": "out",
                      "top": "out"
                    },
                    "random": false,
                    "size": false,
                    "speed": 2,
                    "spin": {
                      "acceleration": 0,
                      "enable": false
                    },
                    "straight": true,
                    "trail": {
                      "enable": false,
                      "length": 10,
                      "fill": {}
                    },
                    "vibrate": false,
                    "warp": false
                  },
                  "number": {
                    "density": {
                      "enable": true,
                      "width": 1920,
                      "height": 1080
                    },
                    "limit": {
                      "mode": "delete",
                      "value": 0
                    },
                    "value": 400
                  },
                  "opacity": {
                    "value": 1,
                    "animation": {
                      "count": 0,
                      "enable": false,
                      "speed": 2,
                      "decay": 0,
                      "delay": 0,
                      "sync": false,
                      "mode": "auto",
                      "startValue": "random",
                      "destroy": "none"
                    }
                  },
                  "reduceDuplicates": false,
                  "shadow": {
                    "blur": 0,
                    "color": {
                      "value": "#000"
                    },
                    "enable": false,
                    "offset": {
                      "x": 0,
                      "y": 0
                    }
                  },
                  "shape": {
                    "close": true,
                    "fill": true,
                    "options": {},
                    "type": "circle"
                  },
                  "size": {
                    "value": 10,
                    "animation": {
                      "count": 0,
                      "enable": false,
                      "speed": 5,
                      "decay": 0,
                      "delay": 0,
                      "sync": false,
                      "mode": "auto",
                      "startValue": "random",
                      "destroy": "none"
                    }
                  },
                  "stroke": {
                    "width": 0
                  },
                  "zIndex": {
                    "value": {
                      "min": 0,
                      "max": 100
                    },
                    "opacityRate": 10,
                    "sizeRate": 10,
                    "velocityRate": 10
                  },
                  "destroy": {
                    "bounds": {},
                    "mode": "none",
                    "split": {
                      "count": 1,
                      "factor": {
                        "value": 3
                      },
                      "rate": {
                        "value": {
                          "min": 4,
                          "max": 9
                        }
                      },
                      "sizeOffset": true,
                      "particles": {}
                    }
                  },
                  "roll": {
                    "darken": {
                      "enable": false,
                      "value": 0
                    },
                    "enable": false,
                    "enlighten": {
                      "enable": false,
                      "value": 0
                    },
                    "mode": "vertical",
                    "speed": 25
                  },
                  "tilt": {
                    "value": 0,
                    "animation": {
                      "enable": false,
                      "speed": 0,
                      "decay": 0,
                      "sync": false
                    },
                    "direction": "clockwise",
                    "enable": false
                  },
                  "twinkle": {
                    "lines": {
                      "enable": false,
                      "frequency": 0.05,
                      "opacity": 1
                    },
                    "particles": {
                      "enable": false,
                      "frequency": 0.05,
                      "opacity": 1
                    }
                  },
                  "wobble": {
                    "distance": 10,
                    "enable": true,
                    "speed": {
                      "angle": 10,
                      "move": 10
                    }
                  },
                  "life": {
                    "count": 0,
                    "delay": {
                      "value": 0,
                      "sync": false
                    },
                    "duration": {
                      "value": 0,
                      "sync": false
                    }
                  },
                  "rotate": {
                    "value": 0,
                    "animation": {
                      "enable": false,
                      "speed": 0,
                      "decay": 0,
                      "sync": false
                    },
                    "direction": "clockwise",
                    "path": false
                  },
                  "orbit": {
                    "animation": {
                      "count": 0,
                      "enable": false,
                      "speed": 1,
                      "decay": 0,
                      "delay": 0,
                      "sync": false
                    },
                    "enable": false,
                    "opacity": 1,
                    "rotation": {
                      "value": 45
                    },
                    "width": 1
                  },
                  "links": {
                    "blink": false,
                    "color": {
                      "value": "#fff"
                    },
                    "consent": false,
                    "distance": 100,
                    "enable": false,
                    "frequency": 1,
                    "opacity": 1,
                    "shadow": {
                      "blur": 5,
                      "color": {
                        "value": "#000"
                      },
                      "enable": false
                    },
                    "triangles": {
                      "enable": false,
                      "frequency": 1
                    },
                    "width": 1,
                    "warp": false
                  },
                  "repulse": {
                    "value": 0,
                    "enabled": false,
                    "distance": 1,
                    "duration": 1,
                    "factor": 1,
                    "speed": 1
                  }
                },
                "pauseOnBlur": true,
                "pauseOnOutsideViewport": true,
                "responsive": [],
                "smooth": false,
                "style": {},
                "themes": [],
                "zLayers": 100,
                "name": "Snow",
                "motion": {
                  "disable": false,
                  "reduce": {
                    "factor": 4,
                    "value": true
                  }
                }
              },
              // 직사각형들 올라가는거
              {"autoPlay": true, "fullScreen": true, "background":{ "image":" linear-gradient(19deg, #21D4FD 0%, #B721FF 100%)" }, "particles":{ "number":{ "value":10, "density":{ "enable":true, "value_area":600 } }, "color":{ "value":"#ffffff" }, "shape": { "type": "square", "stroke":{ "width":0, "color":"#000000" }, "polygon":{ "nb_sides":5 } }, "opacity":{ "value":0.25, "random":true, "anim":{ "enable":false, "speed":1, "opacity_min":0.1, "sync":false } }, "size":{ "value":29, "random":true, "anim":{ "enable":false, "speed":2, "size_min":0.1, "sync":false } }, "line_linked":{ "enable":false, "distance":300, "color":"#ffffff", "opacity":0, "width":0 }, "move":{ "enable":true, "speed":0.5, "direction":"top", "straight":true, "out_mode":"out", "bounce":false, "attract":{ "enable":false, "rotateX":600, "rotateY":1200 } } }, "interactivity":{ "detect_on":"canvas", "events":{ "onhover":{ "enable":false, "mode":"repulse" }, "onclick":{ "enable":false, "mode":"push" }, "resize":true }, "modes":{ "grab":{ "distance":800, "line_linked":{ "opacity":1 } }, "bubble":{ "distance":790, "size":79, "duration":2, "opacity":0.8, "speed":3 }, "repulse":{ "distance":400, "duration":0.4 }, "push":{ "particles_nb":4 }, "remove":{ "particles_nb":2 } } }, "retina_detect":true},
              // 엄청 큰 원 막 올라가는거
              {
                "autoPlay": true,
                "background": {
                  "color": {
                    "value": "#ffffff"
                  },
                  "image": "",
                  "position": "",
                  "repeat": "",
                  "size": "",
                  "opacity": 1
                },
                "backgroundMask": {
                  "composite": "destination-out",
                  "cover": {
                    "color": {
                      "value": "#fff"
                    },
                    "opacity": 1
                  },
                  "enable": false
                },
                "clear": true,
                "defaultThemes": {},
                "delay": 0,
                "fullScreen": {
                  "enable": true,
                  "zIndex": 0
                },
                "detectRetina": true,
                "duration": 0,
                "fpsLimit": 120,
                "interactivity": {
                  "detectsOn": "window",
                  "events": {
                    "onClick": {
                      "enable": false,
                      "mode": []
                    },
                    "onDiv": {
                      "selectors": [],
                      "enable": false,
                      "mode": [],
                      "type": "circle"
                    },
                    "onHover": {
                      "enable": false,
                      "mode": [],
                      "parallax": {
                        "enable": false,
                        "force": 2,
                        "smooth": 10
                      }
                    },
                    "resize": {
                      "delay": 0.5,
                      "enable": true
                    }
                  },
                  "modes": {
                    "trail": {
                      "delay": 1,
                      "pauseOnStop": false,
                      "quantity": 1
                    },
                    "attract": {
                      "distance": 200,
                      "duration": 0.4,
                      "easing": "ease-out-quad",
                      "factor": 1,
                      "maxSpeed": 50,
                      "speed": 1
                    },
                    "bounce": {
                      "distance": 200
                    },
                    "bubble": {
                      "distance": 200,
                      "duration": 0.4,
                      "mix": false
                    },
                    "connect": {
                      "distance": 80,
                      "links": {
                        "opacity": 0.5
                      },
                      "radius": 60
                    },
                    "grab": {
                      "distance": 100,
                      "links": {
                        "blink": false,
                        "consent": false,
                        "opacity": 1
                      }
                    },
                    "push": {
                      "default": true,
                      "groups": [],
                      "quantity": 4
                    },
                    "remove": {
                      "quantity": 2
                    },
                    "repulse": {
                      "distance": 200,
                      "duration": 0.4,
                      "factor": 100,
                      "speed": 1,
                      "maxSpeed": 50,
                      "easing": "ease-out-quad"
                    },
                    "slow": {
                      "factor": 3,
                      "radius": 200
                    },
                    "light": {
                      "area": {
                        "gradient": {
                          "start": {
                            "value": "#ffffff"
                          },
                          "stop": {
                            "value": "#000000"
                          }
                        },
                        "radius": 1000
                      },
                      "shadow": {
                        "color": {
                          "value": "#000000"
                        },
                        "length": 2000
                      }
                    }
                  }
                },
                "manualParticles": [],
                "particles": {
                  "bounce": {
                    "horizontal": {
                      "value": 1
                    },
                    "vertical": {
                      "value": 1
                    }
                  },
                  "collisions": {
                    "absorb": {
                      "speed": 2
                    },
                    "bounce": {
                      "horizontal": {
                        "value": 1
                      },
                      "vertical": {
                        "value": 1
                      }
                    },
                    "enable": false,
                    "maxSpeed": 50,
                    "mode": "bounce",
                    "overlap": {
                      "enable": true,
                      "retries": 0
                    }
                  },
                  "color": {
                    "value": [
                      "#5bc0eb",
                      "#fde74c",
                      "#9bc53d",
                      "#e55934",
                      "#fa7921"
                    ],
                    "animation": {
                      "h": {
                        "count": 0,
                        "enable": false,
                        "speed": 1,
                        "decay": 0,
                        "delay": 0,
                        "sync": true,
                        "offset": 0
                      },
                      "s": {
                        "count": 0,
                        "enable": false,
                        "speed": 1,
                        "decay": 0,
                        "delay": 0,
                        "sync": true,
                        "offset": 0
                      },
                      "l": {
                        "count": 0,
                        "enable": false,
                        "speed": 1,
                        "decay": 0,
                        "delay": 0,
                        "sync": true,
                        "offset": 0
                      }
                    }
                  },
                  "effect": {
                    "close": true,
                    "fill": true,
                    "options": {},
                    "type": []
                  },
                  "groups": {},
                  "move": {
                    "angle": {
                      "offset": 0,
                      "value": 90
                    },
                    "attract": {
                      "distance": 200,
                      "enable": false,
                      "rotate": {
                        "x": 3000,
                        "y": 3000
                      }
                    },
                    "center": {
                      "x": 50,
                      "y": 50,
                      "mode": "percent",
                      "radius": 0
                    },
                    "decay": 0,
                    "distance": {},
                    "direction": "top",
                    "drift": 0,
                    "enable": true,
                    "gravity": {
                      "acceleration": 9.81,
                      "enable": false,
                      "inverse": false,
                      "maxSpeed": 50
                    },
                    "path": {
                      "clamp": true,
                      "delay": {
                        "value": 0
                      },
                      "enable": false,
                      "options": {}
                    },
                    "outModes": {
                      "default": "out",
                      "bottom": "out",
                      "left": "out",
                      "right": "out",
                      "top": "out"
                    },
                    "random": false,
                    "size": false,
                    "speed": 10,
                    "spin": {
                      "acceleration": 0,
                      "enable": false
                    },
                    "straight": false,
                    "trail": {
                      "enable": false,
                      "length": 10,
                      "fill": {}
                    },
                    "vibrate": false,
                    "warp": false
                  },
                  "number": {
                    "density": {
                      "enable": false,
                      "width": 1920,
                      "height": 1080
                    },
                    "limit": {
                      "mode": "delete",
                      "value": 0
                    },
                    "value": 30
                  },
                  "opacity": {
                    "value": {
                      "min": 0.4,
                      "max": 0.8
                    },
                    "animation": {
                      "count": 0,
                      "enable": false,
                      "speed": 2,
                      "decay": 0,
                      "delay": 0,
                      "sync": false,
                      "mode": "auto",
                      "startValue": "random",
                      "destroy": "none"
                    }
                  },
                  "reduceDuplicates": false,
                  "shadow": {
                    "blur": 0,
                    "color": {
                      "value": "#000"
                    },
                    "enable": false,
                    "offset": {
                      "x": 0,
                      "y": 0
                    }
                  },
                  "shape": {
                    "close": true,
                    "fill": true,
                    "options": {},
                    "type": "circle"
                  },
                  "size": {
                    "value": {
                      "min": 300,
                      "max": 400
                    },
                    "animation": {
                      "count": 0,
                      "enable": true,
                      "speed": 100,
                      "decay": 0,
                      "delay": 0,
                      "sync": false,
                      "mode": "auto",
                      "startValue": "random",
                      "destroy": "none"
                    }
                  },
                  "stroke": {
                    "width": 0
                  },
                  "zIndex": {
                    "value": 0,
                    "opacityRate": 1,
                    "sizeRate": 1,
                    "velocityRate": 1
                  },
                  "destroy": {
                    "bounds": {},
                    "mode": "none",
                    "split": {
                      "count": 1,
                      "factor": {
                        "value": 3
                      },
                      "rate": {
                        "value": {
                          "min": 4,
                          "max": 9
                        }
                      },
                      "sizeOffset": true,
                      "particles": {}
                    }
                  },
                  "roll": {
                    "darken": {
                      "enable": false,
                      "value": 0
                    },
                    "enable": false,
                    "enlighten": {
                      "enable": false,
                      "value": 0
                    },
                    "mode": "vertical",
                    "speed": 25
                  },
                  "tilt": {
                    "value": 0,
                    "animation": {
                      "enable": false,
                      "speed": 0,
                      "decay": 0,
                      "sync": false
                    },
                    "direction": "clockwise",
                    "enable": false
                  },
                  "twinkle": {
                    "lines": {
                      "enable": false,
                      "frequency": 0.05,
                      "opacity": 1
                    },
                    "particles": {
                      "enable": false,
                      "frequency": 0.05,
                      "opacity": 1
                    }
                  },
                  "wobble": {
                    "distance": 5,
                    "enable": false,
                    "speed": {
                      "angle": 50,
                      "move": 10
                    }
                  },
                  "life": {
                    "count": 0,
                    "delay": {
                      "value": 0,
                      "sync": false
                    },
                    "duration": {
                      "value": 0,
                      "sync": false
                    }
                  },
                  "rotate": {
                    "value": 0,
                    "animation": {
                      "enable": false,
                      "speed": 0,
                      "decay": 0,
                      "sync": false
                    },
                    "direction": "clockwise",
                    "path": false
                  },
                  "orbit": {
                    "animation": {
                      "count": 0,
                      "enable": false,
                      "speed": 1,
                      "decay": 0,
                      "delay": 0,
                      "sync": false
                    },
                    "enable": false,
                    "opacity": 1,
                    "rotation": {
                      "value": 45
                    },
                    "width": 1
                  },
                  "links": {
                    "blink": false,
                    "color": {
                      "value": "#fff"
                    },
                    "consent": false,
                    "distance": 100,
                    "enable": false,
                    "frequency": 1,
                    "opacity": 1,
                    "shadow": {
                      "blur": 5,
                      "color": {
                        "value": "#000"
                      },
                      "enable": false
                    },
                    "triangles": {
                      "enable": false,
                      "frequency": 1
                    },
                    "width": 1,
                    "warp": false
                  },
                  "repulse": {
                    "value": 0,
                    "enabled": false,
                    "distance": 1,
                    "duration": 1,
                    "factor": 1,
                    "speed": 1
                  }
                },
                "pauseOnBlur": true,
                "pauseOnOutsideViewport": true,
                "responsive": [],
                "smooth": false,
                "style": {},
                "themes": [],
                "zLayers": 100,
                "name": "Big Particles",
                "motion": {
                  "disable": false,
                  "reduce": {
                    "factor": 4,
                    "value": true
                  }
                }
              },
              // 형형색색 배경에 떠다니는 원들
              {
                "autoPlay": true,
                "background": {
                  "color": {
                    "value": "#ffffff"
                  },
                  "image": "url('https://particles.js.org/images/background3.jpg')",
                  "position": "50% 50%",
                  "repeat": "no-repeat",
                  "size": "cover",
                  "opacity": 1
                },
                "backgroundMask": {
                  "composite": "destination-out",
                  "cover": {
                    "color": {
                      "value": {
                        "r": 255,
                        "g": 255,
                        "b": 255
                      }
                    },
                    "opacity": 1
                  },
                  "enable": true
                },
                "clear": true,
                "defaultThemes": {},
                "delay": 0,
                "fullScreen": {
                  "enable": true,
                  "zIndex": 0
                },
                "detectRetina": true,
                "duration": 0,
                "fpsLimit": 120,
                "interactivity": {
                  "detectsOn": "window",
                  "events": {
                    "onClick": {
                      "enable": false,
                      "mode": "push"
                    },
                    "onDiv": {
                      "selectors": [],
                      "enable": false,
                      "mode": [],
                      "type": "circle"
                    },
                    "onHover": {
                      "enable": false,
                      "mode": "bubble",
                      "parallax": {
                        "enable": false,
                        "force": 2,
                        "smooth": 10
                      }
                    },
                    "resize": {
                      "delay": 0.5,
                      "enable": true
                    }
                  },
                  "modes": {
                    "trail": {
                      "delay": 1,
                      "pauseOnStop": false,
                      "quantity": 1
                    },
                    "attract": {
                      "distance": 200,
                      "duration": 0.4,
                      "easing": "ease-out-quad",
                      "factor": 1,
                      "maxSpeed": 50,
                      "speed": 1
                    },
                    "bounce": {
                      "distance": 200
                    },
                    "bubble": {
                      "distance": 400,
                      "duration": 2,
                      "mix": false,
                      "opacity": 1,
                      "size": 100,
                      "divs": {
                        "distance": 200,
                        "duration": 0.4,
                        "mix": false,
                        "selectors": []
                      }
                    },
                    "connect": {
                      "distance": 80,
                      "links": {
                        "opacity": 0.5
                      },
                      "radius": 60
                    },
                    "grab": {
                      "distance": 100,
                      "links": {
                        "blink": false,
                        "consent": false,
                        "opacity": 1
                      }
                    },
                    "push": {
                      "default": true,
                      "groups": [],
                      "quantity": 4
                    },
                    "remove": {
                      "quantity": 2
                    },
                    "repulse": {
                      "distance": 200,
                      "duration": 0.4,
                      "factor": 100,
                      "speed": 1,
                      "maxSpeed": 50,
                      "easing": "ease-out-quad",
                      "divs": {
                        "distance": 200,
                        "duration": 0.4,
                        "factor": 100,
                        "speed": 1,
                        "maxSpeed": 50,
                        "easing": "ease-out-quad",
                        "selectors": []
                      }
                    },
                    "slow": {
                      "factor": 3,
                      "radius": 200
                    },
                    "light": {
                      "area": {
                        "gradient": {
                          "start": {
                            "value": "#ffffff"
                          },
                          "stop": {
                            "value": "#000000"
                          }
                        },
                        "radius": 1000
                      },
                      "shadow": {
                        "color": {
                          "value": "#000000"
                        },
                        "length": 2000
                      }
                    }
                  }
                },
                "manualParticles": [],
                "particles": {
                  "bounce": {
                    "horizontal": {
                      "value": 1
                    },
                    "vertical": {
                      "value": 1
                    }
                  },
                  "collisions": {
                    "absorb": {
                      "speed": 2
                    },
                    "bounce": {
                      "horizontal": {
                        "value": 1
                      },
                      "vertical": {
                        "value": 1
                      }
                    },
                    "enable": false,
                    "maxSpeed": 50,
                    "mode": "bounce",
                    "overlap": {
                      "enable": true,
                      "retries": 0
                    }
                  },
                  "color": {
                    "value": "#ffffff",
                    "animation": {
                      "h": {
                        "count": 0,
                        "enable": false,
                        "speed": 1,
                        "decay": 0,
                        "delay": 0,
                        "sync": true,
                        "offset": 0
                      },
                      "s": {
                        "count": 0,
                        "enable": false,
                        "speed": 1,
                        "decay": 0,
                        "delay": 0,
                        "sync": true,
                        "offset": 0
                      },
                      "l": {
                        "count": 0,
                        "enable": false,
                        "speed": 1,
                        "decay": 0,
                        "delay": 0,
                        "sync": true,
                        "offset": 0
                      }
                    }
                  },
                  "effect": {
                    "close": true,
                    "fill": true,
                    "options": {},
                    "type": []
                  },
                  "groups": {},
                  "move": {
                    "angle": {
                      "offset": 0,
                      "value": 90
                    },
                    "attract": {
                      "distance": 200,
                      "enable": false,
                      "rotate": {
                        "x": 3000,
                        "y": 3000
                      }
                    },
                    "center": {
                      "x": 50,
                      "y": 50,
                      "mode": "percent",
                      "radius": 0
                    },
                    "decay": 0,
                    "distance": {},
                    "direction": "none",
                    "drift": 0,
                    "enable": true,
                    "gravity": {
                      "acceleration": 9.81,
                      "enable": false,
                      "inverse": false,
                      "maxSpeed": 50
                    },
                    "path": {
                      "clamp": true,
                      "delay": {
                        "value": 0
                      },
                      "enable": false,
                      "options": {}
                    },
                    "outModes": {
                      "default": "out",
                      "bottom": "out",
                      "left": "out",
                      "right": "out",
                      "top": "out"
                    },
                    "random": false,
                    "size": false,
                    "speed": 2,
                    "spin": {
                      "acceleration": 0,
                      "enable": false
                    },
                    "straight": false,
                    "trail": {
                      "enable": false,
                      "length": 10,
                      "fill": {}
                    },
                    "vibrate": false,
                    "warp": false
                  },
                  "number": {
                    "density": {
                      "enable": true,
                      "width": 1920,
                      "height": 1080
                    },
                    "limit": {
                      "mode": "delete",
                      "value": 0
                    },
                    "value": 80
                  },
                  "opacity": {
                    "value": 1,
                    "animation": {
                      "count": 0,
                      "enable": false,
                      "speed": 2,
                      "decay": 0,
                      "delay": 0,
                      "sync": false,
                      "mode": "auto",
                      "startValue": "random",
                      "destroy": "none"
                    }
                  },
                  "reduceDuplicates": false,
                  "shadow": {
                    "blur": 0,
                    "color": {
                      "value": "#000"
                    },
                    "enable": false,
                    "offset": {
                      "x": 0,
                      "y": 0
                    }
                  },
                  "shape": {
                    "close": true,
                    "fill": true,
                    "options": {},
                    "type": "circle"
                  },
                  "size": {
                    "value": {
                      "min": 1,
                      "max": 30
                    },
                    "animation": {
                      "count": 0,
                      "enable": false,
                      "speed": 5,
                      "decay": 0,
                      "delay": 0,
                      "sync": false,
                      "mode": "auto",
                      "startValue": "random",
                      "destroy": "none"
                    }
                  },
                  "stroke": {
                    "width": 0
                  },
                  "zIndex": {
                    "value": 0,
                    "opacityRate": 1,
                    "sizeRate": 1,
                    "velocityRate": 1
                  },
                  "destroy": {
                    "bounds": {},
                    "mode": "none",
                    "split": {
                      "count": 1,
                      "factor": {
                        "value": 3
                      },
                      "rate": {
                        "value": {
                          "min": 4,
                          "max": 9
                        }
                      },
                      "sizeOffset": true,
                      "particles": {}
                    }
                  },
                  "roll": {
                    "darken": {
                      "enable": false,
                      "value": 0
                    },
                    "enable": false,
                    "enlighten": {
                      "enable": false,
                      "value": 0
                    },
                    "mode": "vertical",
                    "speed": 25
                  },
                  "tilt": {
                    "value": 0,
                    "animation": {
                      "enable": false,
                      "speed": 0,
                      "decay": 0,
                      "sync": false
                    },
                    "direction": "clockwise",
                    "enable": false
                  },
                  "twinkle": {
                    "lines": {
                      "enable": false,
                      "frequency": 0.05,
                      "opacity": 1
                    },
                    "particles": {
                      "enable": false,
                      "frequency": 0.05,
                      "opacity": 1
                    }
                  },
                  "wobble": {
                    "distance": 5,
                    "enable": false,
                    "speed": {
                      "angle": 50,
                      "move": 10
                    }
                  },
                  "life": {
                    "count": 0,
                    "delay": {
                      "value": 0,
                      "sync": false
                    },
                    "duration": {
                      "value": 0,
                      "sync": false
                    }
                  },
                  "rotate": {
                    "value": 0,
                    "animation": {
                      "enable": false,
                      "speed": 0,
                      "decay": 0,
                      "sync": false
                    },
                    "direction": "clockwise",
                    "path": false
                  },
                  "orbit": {
                    "animation": {
                      "count": 0,
                      "enable": false,
                      "speed": 1,
                      "decay": 0,
                      "delay": 0,
                      "sync": false
                    },
                    "enable": false,
                    "opacity": 1,
                    "rotation": {
                      "value": 45
                    },
                    "width": 1
                  },
                  "links": {
                    "blink": false,
                    "color": {
                      "value": "#ffffff"
                    },
                    "consent": false,
                    "distance": 150,
                    "enable": true,
                    "frequency": 1,
                    "opacity": 1,
                    "shadow": {
                      "blur": 5,
                      "color": {
                        "value": "#000"
                      },
                      "enable": false
                    },
                    "triangles": {
                      "enable": false,
                      "frequency": 1
                    },
                    "width": 1,
                    "warp": false
                  },
                  "repulse": {
                    "value": 0,
                    "enabled": false,
                    "distance": 1,
                    "duration": 1,
                    "factor": 1,
                    "speed": 1
                  }
                },
                "pauseOnBlur": true,
                "pauseOnOutsideViewport": true,
                "responsive": [],
                "smooth": false,
                "style": {},
                "themes": [],
                "zLayers": 100,
                "name": "Background Mask",
                "motion": {
                  "disable": false,
                  "reduce": {
                    "factor": 4,
                    "value": true
                  }
                }
              },
              // 흰 배경에 공 떠다니는거
              {
                "autoPlay": true,
                "background": {
                  "color": {
                    "value": "#ffffff"
                  },
                  "image": "",
                  "position": "50% 50%",
                  "repeat": "no-repeat",
                  "size": "cover",
                  "opacity": 1
                },
                "backgroundMask": {
                  "composite": "destination-out",
                  "cover": {
                    "color": {
                      "value": "#fff"
                    },
                    "opacity": 1
                  },
                  "enable": false
                },
                "clear": true,
                "defaultThemes": {},
                "delay": 0,
                "fullScreen": {
                  "enable": true,
                  "zIndex": 0
                },
                "detectRetina": true,
                "duration": 0,
                "fpsLimit": 120,
                "interactivity": {
                  "detectsOn": "window",
                  "events": {
                    "onClick": {
                      "enable": false,
                      "mode": "push"
                    },
                    "onDiv": {
                      "selectors": [],
                      "enable": false,
                      "mode": [],
                      "type": "circle"
                    },
                    "onHover": {
                      "enable": false,
                      "mode": "connect",
                      "parallax": {
                        "enable": false,
                        "force": 60,
                        "smooth": 10
                      }
                    },
                    "resize": {
                      "delay": 0.5,
                      "enable": true
                    }
                  },
                  "modes": {
                    "trail": {
                      "delay": 1,
                      "pauseOnStop": false,
                      "quantity": 1
                    },
                    "attract": {
                      "distance": 200,
                      "duration": 0.4,
                      "easing": "ease-out-quad",
                      "factor": 1,
                      "maxSpeed": 50,
                      "speed": 1
                    },
                    "bounce": {
                      "distance": 200
                    },
                    "bubble": {
                      "distance": 400,
                      "duration": 2,
                      "mix": false,
                      "opacity": 0.8,
                      "size": 40,
                      "divs": {
                        "distance": 200,
                        "duration": 0.4,
                        "mix": false,
                        "selectors": []
                      }
                    },
                    "connect": {
                      "distance": 80,
                      "links": {
                        "opacity": 0.5
                      },
                      "radius": 60
                    },
                    "grab": {
                      "distance": 400,
                      "links": {
                        "blink": false,
                        "consent": false,
                        "opacity": 1
                      }
                    },
                    "push": {
                      "default": true,
                      "groups": [],
                      "quantity": 4
                    },
                    "remove": {
                      "quantity": 2
                    },
                    "repulse": {
                      "distance": 200,
                      "duration": 0.4,
                      "factor": 100,
                      "speed": 1,
                      "maxSpeed": 50,
                      "easing": "ease-out-quad",
                      "divs": {
                        "distance": 200,
                        "duration": 0.4,
                        "factor": 100,
                        "speed": 1,
                        "maxSpeed": 50,
                        "easing": "ease-out-quad",
                        "selectors": []
                      }
                    },
                    "slow": {
                      "factor": 3,
                      "radius": 200
                    },
                    "light": {
                      "area": {
                        "gradient": {
                          "start": {
                            "value": "#ffffff"
                          },
                          "stop": {
                            "value": "#000000"
                          }
                        },
                        "radius": 1000
                      },
                      "shadow": {
                        "color": {
                          "value": "#000000"
                        },
                        "length": 2000
                      }
                    }
                  }
                },
                "manualParticles": [],
                "particles": {
                  "bounce": {
                    "horizontal": {
                      "value": 1
                    },
                    "vertical": {
                      "value": 1
                    }
                  },
                  "collisions": {
                    "absorb": {
                      "speed": 2
                    },
                    "bounce": {
                      "horizontal": {
                        "value": 1
                      },
                      "vertical": {
                        "value": 1
                      }
                    },
                    "enable": false,
                    "maxSpeed": 50,
                    "mode": "bounce",
                    "overlap": {
                      "enable": true,
                      "retries": 0
                    }
                  },
                  "color": {
                    "value": "random",
                    "animation": {
                      "h": {
                        "count": 0,
                        "enable": false,
                        "speed": 1,
                        "decay": 0,
                        "delay": 0,
                        "sync": true,
                        "offset": 0
                      },
                      "s": {
                        "count": 0,
                        "enable": false,
                        "speed": 1,
                        "decay": 0,
                        "delay": 0,
                        "sync": true,
                        "offset": 0
                      },
                      "l": {
                        "count": 0,
                        "enable": false,
                        "speed": 1,
                        "decay": 0,
                        "delay": 0,
                        "sync": true,
                        "offset": 0
                      }
                    }
                  },
                  "effect": {
                    "close": true,
                    "fill": true,
                    "options": {},
                    "type": []
                  },
                  "groups": {},
                  "move": {
                    "angle": {
                      "offset": 0,
                      "value": 90
                    },
                    "attract": {
                      "distance": 200,
                      "enable": false,
                      "rotate": {
                        "x": 3000,
                        "y": 3000
                      }
                    },
                    "center": {
                      "x": 50,
                      "y": 50,
                      "mode": "percent",
                      "radius": 0
                    },
                    "decay": 0,
                    "distance": {},
                    "direction": "none",
                    "drift": 0,
                    "enable": true,
                    "gravity": {
                      "acceleration": 9.81,
                      "enable": false,
                      "inverse": false,
                      "maxSpeed": 50
                    },
                    "path": {
                      "clamp": true,
                      "delay": {
                        "value": 0
                      },
                      "enable": false,
                      "options": {}
                    },
                    "outModes": {
                      "default": "out",
                      "bottom": "out",
                      "left": "out",
                      "right": "out",
                      "top": "out"
                    },
                    "random": false,
                    "size": false,
                    "speed": 6,
                    "spin": {
                      "acceleration": 0,
                      "enable": false
                    },
                    "straight": false,
                    "trail": {
                      "enable": false,
                      "length": 10,
                      "fill": {}
                    },
                    "vibrate": false,
                    "warp": false
                  },
                  "number": {
                    "density": {
                      "enable": true,
                      "width": 1920,
                      "height": 1080
                    },
                    "limit": {
                      "mode": "delete",
                      "value": 500
                    },
                    "value": 300
                  },
                  "opacity": {
                    "value": 0.5,
                    "animation": {
                      "count": 0,
                      "enable": false,
                      "speed": 2,
                      "decay": 0,
                      "delay": 0,
                      "sync": false,
                      "mode": "auto",
                      "startValue": "random",
                      "destroy": "none"
                    }
                  },
                  "reduceDuplicates": false,
                  "shadow": {
                    "blur": 0,
                    "color": {
                      "value": "#000"
                    },
                    "enable": false,
                    "offset": {
                      "x": 0,
                      "y": 0
                    }
                  },
                  "shape": {
                    "close": true,
                    "fill": true,
                    "options": {},
                    "type": "circle"
                  },
                  "size": {
                    "value": {
                      "min": 10,
                      "max": 15
                    },
                    "animation": {
                      "count": 0,
                      "enable": false,
                      "speed": 5,
                      "decay": 0,
                      "delay": 0,
                      "sync": false,
                      "mode": "auto",
                      "startValue": "random",
                      "destroy": "none"
                    }
                  },
                  "stroke": {
                    "width": 0
                  },
                  "zIndex": {
                    "value": 0,
                    "opacityRate": 1,
                    "sizeRate": 1,
                    "velocityRate": 1
                  },
                  "destroy": {
                    "bounds": {},
                    "mode": "none",
                    "split": {
                      "count": 1,
                      "factor": {
                        "value": 3
                      },
                      "rate": {
                        "value": {
                          "min": 4,
                          "max": 9
                        }
                      },
                      "sizeOffset": true,
                      "particles": {}
                    }
                  },
                  "roll": {
                    "darken": {
                      "enable": false,
                      "value": 0
                    },
                    "enable": false,
                    "enlighten": {
                      "enable": false,
                      "value": 0
                    },
                    "mode": "vertical",
                    "speed": 25
                  },
                  "tilt": {
                    "value": 0,
                    "animation": {
                      "enable": false,
                      "speed": 0,
                      "decay": 0,
                      "sync": false
                    },
                    "direction": "clockwise",
                    "enable": false
                  },
                  "twinkle": {
                    "lines": {
                      "enable": false,
                      "frequency": 0.05,
                      "opacity": 1
                    },
                    "particles": {
                      "enable": false,
                      "frequency": 0.05,
                      "opacity": 1
                    }
                  },
                  "wobble": {
                    "distance": 5,
                    "enable": false,
                    "speed": {
                      "angle": 50,
                      "move": 10
                    }
                  },
                  "life": {
                    "count": 0,
                    "delay": {
                      "value": 0,
                      "sync": false
                    },
                    "duration": {
                      "value": 0,
                      "sync": false
                    }
                  },
                  "rotate": {
                    "value": 0,
                    "animation": {
                      "enable": false,
                      "speed": 0,
                      "decay": 0,
                      "sync": false
                    },
                    "direction": "clockwise",
                    "path": false
                  },
                  "orbit": {
                    "animation": {
                      "count": 0,
                      "enable": false,
                      "speed": 1,
                      "decay": 0,
                      "delay": 0,
                      "sync": false
                    },
                    "enable": false,
                    "opacity": 1,
                    "rotation": {
                      "value": 45
                    },
                    "width": 1
                  },
                  "links": {
                    "blink": false,
                    "color": {
                      "value": "#ffffff"
                    },
                    "consent": false,
                    "distance": 150,
                    "enable": false,
                    "frequency": 1,
                    "opacity": 0.4,
                    "shadow": {
                      "blur": 5,
                      "color": {
                        "value": "#000"
                      },
                      "enable": false
                    },
                    "triangles": {
                      "enable": false,
                      "frequency": 1
                    },
                    "width": 1,
                    "warp": false
                  },
                  "repulse": {
                    "value": 0,
                    "enabled": false,
                    "distance": 1,
                    "duration": 1,
                    "factor": 1,
                    "speed": 1
                  }
                },
                "pauseOnBlur": true,
                "pauseOnOutsideViewport": true,
                "responsive": [],
                "smooth": false,
                "style": {},
                "themes": [],
                "zLayers": 100,
                "name": "Random Colors",
                "motion": {
                  "disable": false,
                  "reduce": {
                    "factor": 4,
                    "value": true
                  }
                }
              }
    ]

    const optionsRef = useRef<any>(particleOptions[4])
    // const optionsRef = useRef<any>(particleOptions[Math.floor((Math.random()*6)+0)])

    const particlesInit = useCallback(async (engine: Engine) => {
        console.log(engine);
    
        // you can initialize the tsParticles instance (engine) here, adding custom shapes or presets
        // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
        // starting from v2 you can add only the features you need reducing the bundle size
        //await loadFull(engine);
        await loadSlim(engine);
    }, []);
    
    const particlesLoaded = useCallback(async (container: Container | undefined) => {
        await console.log(container);
    }, []);

    return(<Particles
      ref={particleRef}
  id="tsparticles"
  init={particlesInit}
  loaded={particlesLoaded}
  options={optionsRef.current}
          />)
}

export default React.memo(Particle);