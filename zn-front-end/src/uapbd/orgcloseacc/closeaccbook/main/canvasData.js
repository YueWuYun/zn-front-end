//7GybipSIlpjxcU5y0Z9M3ewpz3ev6nTY89/vWfj85mdH0vNcTl3UOOiHo7k0qTtl
let spaceX = 50,
    spaceY = 0,
    width = 232,
    height = 80,
    positionX = spaceX + width;
let phonyData = {
    CLOSED: "已关账",
    NO_CLOSED: "未关账",
    PART_CLOSED: "部分关账",
    PART_SETTLED: "部分结账",
    Period: "2018-10",
    SETTLED: "已结账",
    modules: {
        AP: {
            closedType: "PARTCLOSED",
            m_isDirty: false,
            moudleName: "应付管理",
            pl_module: "AP",
            status: 0
        },
        AR: {
            closedType: "NOCLOSED",
            m_isDirty: false,
            moudleName: "应收管理",
            pl_module: "AR",
            status: 0
        },
        ERM: {
            closedType: "CLOSED",
            m_isDirty: false,
            moudleName: "费用管理",
            pl_module: "ERM",
            status: 0
        },
        IC: {
            closedType: "PARTSETTLED",
            m_isDirty: false,
            moudleName: "库存管理",
            pl_module: "IC",
            status: 0
        },
        IA: {
            closedType: "SETTLED",
            m_isDirty: false,
            moudleName: "存提核算",
            pl_module: "IA",
            status: 0
        },
        PCA: {
            closedType: "NOCLOSED",
            m_isDirty: false,
            moudleName: "项目成本",
            pl_module: "PCA",
            status: 0
        },
        TXM: {
            closedType: "NOCLOSED",
            m_isDirty: false,
            moudleName: "税务管理",
            pl_module: "TXM",
            status: 0
        },
        CM: {
            closedType: "NOCLOSED",
            m_isDirty: false,
            moudleName: "产品成本",
            pl_module: "CM",
            status: 0
        },
        SCABA: {
            closedType: "NOCLOSED",
            m_isDirty: false,
            moudleName: "标准成本核算",
            pl_module: "SCABA",
            status: 0
        },
        CMP: {
            closedType: "CLOSED",
            m_isDirty: false,
            moudleName: "现金管理",
            pl_module: "CMP",
            status: 0
        },
        GL: {
            closedType: "PARTSETTLED",
            m_isDirty: false,
            moudleName: "总账",
            pl_module: "GL",
            status: 0
        }
    },
    modulesRelation: {
        'AP=CMP': '',
        'AR=CMP': '',
        'ERM=CMP': '',
        'CMP=GL': '',
        'IC=IA': '',
        'IA=PCA': '',
        'PCA=GL': '',
        'CM=GL': '',
        'SCABA=GL': '',
        'TXM=GL': '',
    }
};
let coodr = {
    AR: { x: spaceX, y: height * 4 },
    AP: { x: positionX + spaceX, y: height * 4 },
    ERM:{ x: positionX*2 + spaceX, y: height * 4 },
    CMP: { x: spaceX, y: height * 7 },
    IC: { x: positionX * 3 + spaceX, y: height },
    IA: { x: positionX * 3 + spaceX, y: height * 3 },
    PCA: { x: positionX * 3 + spaceX, y: height * 5 },
    CM: { x: positionX * 4.5 + spaceX, y: height * 7 },
    SCABA: { x: positionX * 4.5 + spaceX, y: height * 7 },
    TXM: { x: positionX * 4.5 + spaceX, y: height * 9 },
    GL: { x: positionX * 3 + spaceX, y: height * 10 },
}

let typeColor = {
    PARTCLOSED: {
        FillColor: '#B5E0FF',
        FontColor: '#007ACE',
        BorderColor: '#FFFFFF'
    },
    NOCLOSED: {
        FillColor: '#519DFF',
        FontColor: '#FFFFFF',
        BorderColor: '#FFFFFF'
    },
    CLOSED: {
        FillColor: '#FFFFFF',
        FontColor: '#007ACE',
        BorderColor: '#07ABDE'
    },
    PARTSETTLED: {
        FillColor: '#FFDA86',
        FontColor: '#FFFFFF',
        BorderColor: '#FFFFFF'
    }
    ,
    SETTLED: {
        FillColor: '#FFFFFF',
        FontColor: '#F87321',
        BorderColor: '#F87321'
    }
};

let lineMess = {
    AP: {
        x: coodr.AP.x + width / 2,
        y: coodr.AP.y + height,
        CMP: {
            x: coodr.CMP.x + width / 2 + 10,
            y: coodr.CMP.y
        },
        GL: {
            x: coodr.GL.x,
            y: coodr.GL.y + height / 2 + 10
        }
    },
    AR: {
        x: coodr.AR.x + width / 2,
        y: coodr.AR.y + height,
        CMP: {
            x: coodr.CMP.x + width / 2,
            y: coodr.CMP.y
        },
        GL: {
            x: coodr.GL.x,
            y: coodr.GL.y + height / 2
        }
    },
    ERM: {
        x: coodr.ERM.x + width / 2,
        y: coodr.ERM.y + height,
        CMP: {
            x: coodr.CMP.x + width / 2 + 30,
            y: coodr.CMP.y
        },
        GL: {
            x: coodr.GL.x,
            y: coodr.GL.y + height / 2 - 10
        }
    },
    CMP: {
        x: coodr.CMP.x + width / 2,
        y: coodr.CMP.y + height,
        GL: {
            x: coodr.GL.x,
            y: coodr.GL.y + height / 2
        }
    },
    IC: {
        x: coodr.IC.x + width / 2,
        y: coodr.IC.y + height,
        IA: {
            x: coodr.IA.x + width / 2,
            y: coodr.IA.y
        },
        PCA: {
            x: coodr.PCA.x + width / 2,
            y: coodr.PCA.y
        },
        GL: {
            x: coodr.GL.x + width / 2,
            y: coodr.GL.y
        }
    },
    IA: {
        x: coodr.IA.x + width / 2,
        y: coodr.IA.y + height,
        PCA: {
            x: coodr.PCA.x + width / 2,
            y: coodr.PCA.y
        },
        GL: {
            x: coodr.GL.x + width / 2,
            y: coodr.GL.y
        }
    },
    PCA: {
        x: coodr.PCA.x + width / 2,
        y: coodr.PCA.y + height,
        GL: {
            x: coodr.GL.x + width / 2,
            y: coodr.GL.y
        }
    },
    CM: {
        x: coodr.CM.x,
        y: coodr.CM.y + height/2,
        GL: {
            x: coodr.GL.x + width / 2 + 10,
            y: coodr.GL.y
        }
    },
    SCABA: {
        x: coodr.SCABA.x,
        y: coodr.SCABA.y + height/2,
        GL: {
            x: coodr.GL.x + width / 2 + 10,
            y: coodr.GL.y
        }
    },
    TXM: {
        x: coodr.TXM.x,
        y: coodr.TXM.y + height/2,
        GL: {
            x: coodr.GL.x + width,
            y: coodr.GL.y + height/2
        }
    },
}



export { spaceX, spaceY, width, height, positionX, typeColor, lineMess, coodr, phonyData };
//7GybipSIlpjxcU5y0Z9M3ewpz3ev6nTY89/vWfj85mdH0vNcTl3UOOiHo7k0qTtl