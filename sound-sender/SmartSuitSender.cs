using UnityEngine;
using System.Collections;
using System;

public class SmartSuitSender : MonoBehaviour
{
    private WebSocket w;
    public String uri = "ws://127.0.0.1:3000";

    IEnumerator Start()
    {
        w = new WebSocket(new Uri(uri));
        yield return StartCoroutine(w.Connect());
    }

    private void Update()
    {
        TraverseHierarchy(this.gameObject.transform);
    }

    void TraverseHierarchy(Transform root)
    {
        foreach (Transform child in root)
        {
            String msg = "{";
            msg += "\"name\":\"" + child.name + "\",";
            msg += "\"px\":" + child.transform.position.x + ",";
            msg += "\"py\":" + child.transform.position.y + ",";
            msg += "\"pz\":" + child.transform.position.z + ",";
            msg += "\"rx\":" + child.transform.rotation.x + ",";
            msg += "\"ry\":" + child.transform.rotation.y + ",";
            msg += "\"rz\":" + child.transform.rotation.z + ",";
            msg += "\"sx\":" + child.transform.scale.x + ",";
            msg += "\"sy\":" + child.transform.scale.y + ",";
            msg += "\"sz\":" + child.transform.scale.z;
            msg += "}";
            //Debug.Log(msg);
            w.SendString(msg);
            TraverseHierarchy(child);
        }
    }
}
